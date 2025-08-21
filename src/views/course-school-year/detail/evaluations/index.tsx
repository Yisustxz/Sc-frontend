import { FunctionComponent, useCallback, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { EvaluationsProps } from './types';
import LapsesAccordion from './list/LapsesAccordion';
import { Evaluation, EvaluationType, EvaluationDto } from 'core/evaluations/types';
import EvaluationModal from './form/modal';
import { EvaluationFormData } from './form/types';
import createEvaluation from 'services/evaluations/create-evaluation';
import updateEvaluation from 'services/evaluations/update-evaluation';
import deleteEvaluation from 'services/evaluations/delete-evaluation';
import { setErrorMessage, setIsLoading, setSuccessMessage } from 'store/customizationSlice';
import DialogDelete from 'components/dialogDelete';
import BackendError from 'exceptions/backend-error';

const Evaluations: FunctionComponent<EvaluationsProps> = ({
  schoolYear,
  evaluations: initialEvaluations,
  onAddEvaluation,
  onEditEvaluation,
  onDeleteEvaluation,
  onViewEvaluation,
  courseSchoolYear,
  loading = false,
  setLapseExpanded,
  setCourtExpanded
}) => {
  const dispatch = useDispatch();

  // Estado local para manejar las evaluaciones
  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations);

  // Estado para el modal de evaluación
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Partial<Evaluation> | undefined>(undefined);
  
  // Estado para el diálogo de confirmación de eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState<number | null>(null);

  // Abrir modal para agregar evaluación
  const handleOpenAddModal = useCallback((evaluation: Partial<Evaluation>) => {
    setSelectedEvaluation({
      ...evaluation,
    });
    setModalOpen(true);
  }, []);

  // Abrir modal para editar evaluación
  const handleOpenEditModal = useCallback((id: number, evaluation: Partial<Evaluation>) => {
    setSelectedEvaluation(evaluation);
    setModalOpen(true);
  }, []);

  // Cerrar modal
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedEvaluation(undefined);
  }, []);
  
  // Abrir diálogo de confirmación para eliminar
  const handleOpenDeleteDialog = useCallback((id: number) => {
    setEvaluationToDelete(id);
    setDeleteDialogOpen(true);
  }, []);
  
  // Cerrar diálogo de confirmación
  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setEvaluationToDelete(null);
  }, []);

  // Manejar guardar evaluación desde el modal
  const handleSaveEvaluation = useCallback(async (formData: EvaluationFormData) => {

    if (!courseSchoolYear?.id) {
      dispatch(setErrorMessage('No se pudo identificar el curso-año escolar'));
      return;
    }

    dispatch(setIsLoading(true));
    try {
      if (formData.id) {
        console.log('IS EDITING');

        // Actualizar evaluación existente
        const evaluationDto: Partial<EvaluationDto> = {
          name: formData.name,
          schoolCourtId: formData.schoolCourtId,
          percentage: formData.percentage,
          type: formData.type,
          courseSchoolYearId: courseSchoolYear?.id || formData.courseSchoolYearId,
          projectedDate: formData.projectedDate,
          correlative: formData.correlative
        };

        const updatedEvaluation = await updateEvaluation(formData.id, evaluationDto);

        if (onEditEvaluation) {
          // Llamar al callback del padre si existe
          await onEditEvaluation(formData.id, updatedEvaluation);
        } else {
          // Actualizar localmente si no hay callback
          setEvaluations(prevEvaluations => 
            prevEvaluations.map(evaluation => 
              evaluation.id === formData.id ? updatedEvaluation : evaluation
            )
          );
          dispatch(setSuccessMessage('Evaluación actualizada con éxito'));
        }
      } else {
        console.log('IS CREATING');

        // Crear nueva evaluación
        const evaluationDto: EvaluationDto = {
          name: formData.name,
          schoolCourtId: formData.schoolCourtId,
          percentage: formData.percentage,
          type: formData.type,
          courseSchoolYearId: courseSchoolYear.id,
          projectedDate: formData.projectedDate,
          correlative: formData.correlative
        };

        const newEvaluation = await createEvaluation(evaluationDto);

        if (onAddEvaluation) {
          // Llamar al callback del padre si existe
          await onAddEvaluation(newEvaluation);
        } else {
          // Actualizar localmente si no hay callback
          setEvaluations(prevEvaluations => [...prevEvaluations, newEvaluation]);
          dispatch(setSuccessMessage('Evaluación creada con éxito'));
        }
      }
      
      // Cerrar el modal después de la operación exitosa
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar la evaluación:', error);
      dispatch(setErrorMessage('Ocurrió un error al guardar la evaluación'));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [courseSchoolYear?.id, onAddEvaluation, onEditEvaluation, handleCloseModal, dispatch]);

  // Confirmar y eliminar evaluación
  const handleConfirmDelete = useCallback(async () => {
    if (!evaluationToDelete) return;
    
    const idToDelete = evaluationToDelete;
    
    dispatch(setIsLoading(true));
    try {
      await deleteEvaluation(idToDelete);
      
      if (onDeleteEvaluation) {
        // Llamar al callback del padre si existe
        await onDeleteEvaluation(idToDelete);
      } else {
        // Actualizar localmente si no hay callback
        setEvaluations(prevEvaluations => 
          prevEvaluations.filter(evaluation => evaluation.id !== idToDelete)
        );
        dispatch(setSuccessMessage('Evaluación eliminada con éxito'));
      }
    } catch (error) {
      console.error('Error al eliminar la evaluación:', error);
      dispatch(setErrorMessage('Ocurrió un error al eliminar la evaluación'));
    } finally {
      dispatch(setIsLoading(false));
      handleCloseDeleteDialog();
    }
  }, [evaluationToDelete, onDeleteEvaluation, dispatch, handleCloseDeleteDialog]);

  // Mostrar cargando
  if (loading || !courseSchoolYear) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <LapsesAccordion
        schoolYear={schoolYear}
        evaluations={evaluations}
        onAddEvaluation={handleOpenAddModal}
        onEditEvaluation={handleOpenEditModal}
        onDeleteEvaluation={handleOpenDeleteDialog}
        onViewEvaluation={onViewEvaluation}
        setLapseExpanded={setLapseExpanded}
        setCourtExpanded={setCourtExpanded}
      />

      {/* Modal de evaluación */}
      <EvaluationModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvaluation}
        evaluation={selectedEvaluation}
        courseSchoolYear={courseSchoolYear}
      />
      
      {/* Diálogo de confirmación de eliminación */}
      <DialogDelete
        open={deleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        onDelete={handleConfirmDelete}
      />
    </>
  );
};

export default Evaluations;