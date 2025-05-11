import { FunctionComponent, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { IconPlus } from '@tabler/icons';
import { EvaluationsProps } from './types';
import LapsesAccordion from './LapsesAccordion';
import { Evaluation, EvaluationType } from 'core/evaluations/types';
import EvaluationModal from './form/modal';
import { EvaluationFormData } from './form/types';

const Evaluations: FunctionComponent<EvaluationsProps> = ({
  schoolYear,
  evaluations: initialEvaluations,
  onAddEvaluation,
  onEditEvaluation,
  onDeleteEvaluation,
  loading = false
}) => {
  // Estado local para manejar las evaluaciones (útil para mockups o cambios locales)
  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations);
  
  // Estado para el modal de evaluación
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Partial<Evaluation> | undefined>(undefined);
  const [selectedCourtId, setSelectedCourtId] = useState<number | undefined>(undefined);

  // Abrir modal para agregar evaluación
  const handleOpenAddModal = (evaluation: Partial<Evaluation>) => {
    setSelectedEvaluation(undefined);
    setSelectedCourtId(evaluation.schoolCourtId);
    setModalOpen(true);
  };

  // Abrir modal para editar evaluación
  const handleOpenEditModal = (id: number, evaluation: Partial<Evaluation>) => {
    setSelectedEvaluation(evaluation);
    setSelectedCourtId(undefined);
    setModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvaluation(undefined);
    setSelectedCourtId(undefined);
  };

  // Manejar guardar evaluación desde el modal
  const handleSaveEvaluation = (formData: EvaluationFormData) => {
    if (formData.id) {
      // Actualizar evaluación existente
      if (onEditEvaluation) {
        onEditEvaluation(formData.id, formData);
      } else {
        // Mock para desarrollo
        setEvaluations(
          evaluations.map(evaluation => 
            evaluation.id === formData.id ? { ...evaluation, ...formData } : evaluation
          )
        );
      }
    } else {
      // Crear nueva evaluación
      if (onAddEvaluation) {
        onAddEvaluation(formData);
      } else {
        // Mock para desarrollo
        const mockEvaluation: Evaluation = {
          id: Date.now(), // ID temporal
          name: formData.name,
          schoolCourtId: formData.schoolCourtId,
          percentage: formData.percentage,
          type: formData.type,
          courseSchoolYearId: formData.courseSchoolYearId,
          creationDate: new Date().toISOString(),
          projectedDate: formData.projectedDate
        };
        setEvaluations([...evaluations, mockEvaluation]);
      }
    }
  };

  // Manejar eliminar evaluación
  const handleDeleteEvaluation = (id: number) => {
    if (onDeleteEvaluation) {
      onDeleteEvaluation(id);
    } else {
      // Mock para desarrollo
      setEvaluations(evaluations.filter(evaluation => evaluation.id !== id));
    }
  };

  // Mostrar cargando
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Obtener courseSchoolYearId (usando uno de muestra para el mock)
  const courseSchoolYearId = 1; // Esto debería venir de los props en un componente real

  return (
    <>
      <LapsesAccordion
        schoolYear={schoolYear}
        evaluations={evaluations}
        onAddEvaluation={handleOpenAddModal}
        onEditEvaluation={handleOpenEditModal}
        onDeleteEvaluation={handleDeleteEvaluation}
      />
      
      {/* Modal de evaluación */}
      <EvaluationModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvaluation}
        evaluation={selectedEvaluation}
        schoolCourtId={selectedCourtId}
        courseSchoolYearId={courseSchoolYearId}
      />
    </>
  );
};

export default Evaluations; 