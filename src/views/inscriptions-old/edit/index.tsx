import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import BreadcrumbsNav from 'components/BreadcrumbsNav';
import MainCard from 'components/cards/MainCard';
import InscriptionForm from '../form/InscriptionForm';
import { Button, Typography, Box } from '@mui/material';
import { IconChevronLeft } from '@tabler/icons';
import styled from 'styled-components';
import { getOneInscription, updateInscription } from 'services/inscriptions';
import { setIsLoading, setErrorMessage, setSuccessMessage } from 'store/customizationSlice';
import { CreateInscriptionDto, InscriptionDto } from 'core/inscriptions/types/index';

type SubmitFunction = (data: CreateInscriptionDto) => Promise<void>;

const EditInscription = ({ className }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inscription, setInscription] = useState<InscriptionDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar la inscripción existente
  useEffect(() => {
    const fetchInscription = async () => {
      if (!id) return;
      
      try {
        dispatch(setIsLoading(true));
        const data = await getOneInscription(parseInt(id));
        setInscription(data);
      } catch (error) {
        console.error('Error fetching inscription:', error);
        dispatch(setErrorMessage('Error al cargar la inscripción. Intente nuevamente.'));
      } finally {
        setLoading(false);
        dispatch(setIsLoading(false));
      }
    };

    fetchInscription();
  }, [id, dispatch]);

  const handleBack = useCallback(() => {
    navigate('/inscriptions');
  }, [navigate]);

  // Preparar los valores iniciales para el formulario
  const getInitialValues = useCallback(() => {
    if (!inscription) return undefined;

    return {
      studentId: inscription.studentId,
      schoolYearId: inscription.schoolYearId,
      grade: inscription.grade,
      courseInscriptions: inscription.courseInscriptions?.map(ci => ({
        courseSchoolYearId: ci.courseSchoolYearId,
        id: ci.id
      })) || []
    };
  }, [inscription]);

  const handleSubmit: SubmitFunction = useCallback(async (data) => {
    if (isSubmitting || !id) return;
    setIsSubmitting(true);
    dispatch(setIsLoading(true));

    try {
      // Validar que se hayan seleccionado las materias
      if (!data.courseInscriptions || data.courseInscriptions.length === 0) {
        dispatch(setErrorMessage('Debe seleccionar al menos una materia'));
        return;
      }

      // Enviar petición al servidor
      await updateInscription(parseInt(id), data);
      
      // Mostrar mensaje de éxito y navegar a la lista
      dispatch(setSuccessMessage('Inscripción actualizada exitosamente'));
      navigate('/inscriptions');
    } catch (error) {
      console.error('Error updating inscription:', error);
      dispatch(setErrorMessage('Error al actualizar la inscripción. Intente nuevamente.'));
    } finally {
      setIsSubmitting(false);
      dispatch(setIsLoading(false));
    }
  }, [dispatch, navigate, isSubmitting, id]);

  return (
    <div className={className}>
      <BreadcrumbsNav 
        items={[
          { label: 'Inscripciones', path: '/inscriptions' },
          { label: 'Editar Inscripción' }
        ]} 
      />

      <Box className="header-container">
        <Button
          variant="text"
          color="primary"
          startIcon={<IconChevronLeft />}
          onClick={handleBack}
          className="back-button"
        >
          Volver a Inscripciones
        </Button>
        <Typography variant="h4" className="page-title">
          Editar Inscripción
        </Typography>
      </Box>

      <MainCard className="form-card">
        {!loading && inscription && (
          <InscriptionForm 
            onSubmit={handleSubmit} 
            initialValues={getInitialValues()}
            isEdit
          />
        )}

        {loading && (
          <Box className="loading-container">
            <Typography variant="body1" color="textSecondary">
              Cargando información de la inscripción...
            </Typography>
          </Box>
        )}
      </MainCard>
    </div>
  );
};

interface Props {
  className?: string;
}

export default styled(EditInscription)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .header-container {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 4px;
  }

  .back-button {
    text-transform: none;
    font-weight: 500;
    padding: 6px 16px;
    border-radius: 8px;
  }
  
  .page-title {
    font-weight: 500;
  }

  .form-card {
    margin-top: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
`; 