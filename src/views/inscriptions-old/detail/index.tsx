import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { Button, Typography, Grid, Stack, Chip, Divider, Box } from '@mui/material';
import BreadcrumbsNav from 'components/BreadcrumbsNav';
import MainCard from 'components/cards/MainCard';
import styled from 'styled-components';
import { IconChevronLeft, IconEdit, IconTrash } from '@tabler/icons';
import { getOneInscription } from 'services/inscriptions';
import { setIsLoading, setErrorMessage } from 'store/customizationSlice';
import { InscriptionDto } from '../../../core/inscriptions/types';
import { gradeMapping, EducationLevels } from 'core/courses/use-education-levels';
import useDeleteInscription from '../hooks/use-delete-inscription';
import DialogDelete from 'components/dialogDelete';

const DetailInscription = ({ className }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [inscription, setInscription] = useState<InscriptionDto | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Hook para eliminar inscripción
  const { deleteInscription, error } = useDeleteInscription();

  const fetchInscription = useCallback(async () => {
    if (!id) return;
    try {
      dispatch(setIsLoading(true));
      const data = await getOneInscription(parseInt(id));
      setInscription(data);
    } catch (error) {
      dispatch(setErrorMessage('Error al cargar la inscripción'));
      console.error('Error fetching inscription:', error);
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [id, dispatch]);

  useEffect(() => {
    fetchInscription();
  }, [fetchInscription]);

  // Navegación
  const handleBack = useCallback(() => {
    navigate('/inscriptions');
  }, [navigate]);

  const handleEdit = useCallback(() => {
    navigate(`/inscriptions/edit/${id}`);
  }, [navigate, id]);

  // Diálogo de confirmación para eliminar
  const handleOpenDeleteDialog = useCallback(() => {
    setOpenDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setOpenDeleteDialog(false);
  }, []);

  const handleDeleteInscription = useCallback(async () => {
    if (!id) return;
    
    try {
      dispatch(setIsLoading(true));
      await deleteInscription(parseInt(id));
      handleCloseDeleteDialog();
      navigate('/inscriptions');
    } catch (error) {
      console.error('Error deleting inscription:', error);
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [id, deleteInscription, handleCloseDeleteDialog, navigate, dispatch]);

  return (
    <div className={className}>
      <BreadcrumbsNav 
        items={[
          { label: 'Inscripciones', path: '/inscriptions' },
          { label: 'Detalle' }
        ]} 
      />

      <MainCard>
        <div className="detail-header">
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="text"
              color="primary"
              startIcon={<IconChevronLeft />}
              onClick={handleBack}
            >
              Volver
            </Button>
            <Typography variant="h3">Detalles de Inscripción</Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<IconEdit />}
              onClick={handleEdit}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<IconTrash />}
              onClick={handleOpenDeleteDialog}
            >
              Eliminar
            </Button>
          </Stack>
        </div>

        {inscription && (
          <Grid container spacing={3} className="detail-content">
            {/* Información Principal */}
            <Grid item xs={12}>
              <Typography variant="h4" className="section-title">
                Información General
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="field-label">
                Estudiante
              </Typography>
              <Typography variant="body1" className="field-value">
                {inscription.student?.name || 'No disponible'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="field-label">
                Año Escolar
              </Typography>
              <Typography variant="body1" className="field-value">
                {inscription.schoolYear?.code || 'No disponible'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="field-label">
                Grado
              </Typography>
              <Typography variant="body1" className="field-value">
                {gradeMapping[parseInt(inscription.grade) as EducationLevels] || `Grado ${inscription.grade}`}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="field-label">
                Estado
              </Typography>
              <Chip 
                label={'Activa'} 
                color={'success'} 
                size="small" 
              />
            </Grid>

            {/* Materias Inscritas */}
            <Grid item xs={12} className="mt-3">
              <Typography variant="h4" className="section-title">
                Materias Inscritas
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Box className="subjects-container">
                {inscription.courseInscriptions && inscription.courseInscriptions.length > 0 ? (
                  inscription.courseInscriptions.map((course) => (
                    <Chip 
                      key={course.id}
                      label={course.courseSchoolYear?.course?.name || 'Sin nombre'}
                      color="primary"
                      variant="outlined"
                      className="subject-chip"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No hay materias inscritas
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </MainCard>

      <DialogDelete
        open={openDeleteDialog}
        handleClose={handleCloseDeleteDialog}
        onDelete={handleDeleteInscription}
      />
    </div>
  );
};

interface Props {
  className?: string;
}

export default styled(DetailInscription)`
  width: 100%;
  
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .detail-content {
    margin-top: 16px;
  }

  .section-title {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }

  .field-label {
    color: #666;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .field-value {
    font-weight: 400;
  }

  .mt-3 {
    margin-top: 24px;
  }

  .subjects-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }

  .subject-chip {
    margin: 4px;
  }
`; 