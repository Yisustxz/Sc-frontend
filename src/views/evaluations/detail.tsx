import { useState, useCallback } from 'react';
import {
  Grid,
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import MainCard from 'components/cards/MainCard';
import BreadcrumbsNav from 'components/BreadcrumbsNav';
import styled from 'styled-components';
import EvaluationDetails from './evaluation-details';
import StudentsList from './students/list';
import useEvaluationId from './hooks/use-evaluation-id';
import useEvaluationById from './hooks/use-evaluation-by-id';
import EvaluationModal from '../course-school-year/detail/evaluations/form/modal';
import { EvaluationFormData } from '../course-school-year/detail/evaluations/form/types';
import updateEvaluation from 'services/evaluations/update-evaluation';
import { useDispatch } from 'react-redux';
import { setSuccessMessage, setErrorMessage } from 'store/customizationSlice';



interface EvaluationDetailProps {
  className?: string;
}

const EvaluationDetail = ({ className }: EvaluationDetailProps) => {
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Obtener el ID de la evaluación desde los parámetros de URL
  const evaluationId = useEvaluationId();
  
  // Obtener los detalles de la evaluación
  const {
    evaluation,
    isLoading,
    error,
    refetch
  } = useEvaluationById(evaluationId);

  console.log('evaluation ------>', evaluation);

  // Manejar clic en botón de editar
  const handleEditClick = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  // Manejar cierre del modal de edición
  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  // Manejar guardado de la evaluación editada
  const handleSaveEvaluation = useCallback(async (formData: EvaluationFormData) => {
    if (!evaluation?.id) {
      dispatch(setErrorMessage('No se pudo identificar la evaluación'));
      return;
    }

    try {
      const evaluationDto = {
        name: formData.name,
        schoolCourtId: formData.schoolCourtId,
        percentage: formData.percentage,
        type: formData.type,
        courseSchoolYearId: formData.courseSchoolYearId,
        projectedDate: formData.projectedDate,
        correlative: formData.correlative
      };

      await updateEvaluation(evaluation.id, evaluationDto);
      dispatch(setSuccessMessage('Evaluación actualizada con éxito'));
      
      // Refrescar los datos de la evaluación
      refetch();
      
      // Cerrar el modal
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating evaluation:', error);
      dispatch(setErrorMessage('Error al actualizar la evaluación'));
    }
  }, [evaluation?.id, dispatch, refetch]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !evaluation) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant="h5" color="error">
          {error ? `Error: ${error.message}` : 'No se encontró la evaluación'}
        </Typography>
      </Box>
    );
  }

  // Definir las rutas para los breadcrumbs
  const breadcrumbItems = [
    {
      label: 'Detalle de Asignatura',
      path: `/course-school-year/detail/${evaluation.courseSchoolYearId}`
    },
    {
      label: evaluation.name || 'Evaluación'
    }
  ];

  return (
    <div className={className}>
      <Box sx={{ mb: 3 }}>
        <BreadcrumbsNav items={breadcrumbItems} />
      </Box>

      <Grid container spacing={3}>
        {/* Detalles de la evaluación */}
        <Grid item xs={12}>
          <EvaluationDetails
            evaluation={evaluation}
            onEditClick={handleEditClick}
          />
        </Grid>
        {/* Pestañas */}
        <Grid item xs={12}>
          <MainCard>
              {/* Lista de estudiantes */}
              {evaluationId && (
                <StudentsList evaluationId={evaluationId} />
              )}
          </MainCard>
        </Grid>
      </Grid>

      {/* Modal de edición de evaluación */}
      {evaluation && (
        <EvaluationModal
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveEvaluation}
          evaluation={{
            ...evaluation,
            percentage: parseFloat(evaluation.percentage),
            correlative: evaluation.correlative ?? undefined
          }}
          courseSchoolYear={{
            ...evaluation.courseSchoolYear,
            schoolYear: { 
              id: evaluation.courseSchoolYear.schoolYearId, 
              code: '2024',
              startDate: '2024-01-01',
              endDate: '2024-12-31',
              schoolLapses: []
            }
          }}
        />
      )}
    </div>
  );
};

export default styled(EvaluationDetail)`
  .detail-card .MuiCardContent-root,
  .content-card .MuiCardContent-root {
    padding: 12px 16px;
  }

  .title-with-action {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`; 