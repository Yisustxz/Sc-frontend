import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import BreadcrumbsNav from 'components/BreadcrumbsNav';
import MainCard from 'components/cards/MainCard';
import InscriptionForm from '../form/InscriptionForm';
import { Button, Typography, Box } from '@mui/material';
import { IconChevronLeft } from '@tabler/icons';
import styled from 'styled-components';
import { createInscription } from 'services/inscriptions';
import { setIsLoading, setErrorMessage, setSuccessMessage } from 'store/customizationSlice';
import { CreateInscriptionDto } from 'core/inscriptions/types/index';

type SubmitFunction = (data: CreateInscriptionDto) => Promise<void>;

const CreateInscription = ({ className }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = useCallback(() => {
    navigate('/inscriptions');
  }, [navigate]);

  const handleSubmit: SubmitFunction = useCallback(async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    dispatch(setIsLoading(true));

    try {
      // Validar que se hayan seleccionado las materias
      if (!data.courseInscriptions || data.courseInscriptions.length === 0) {
        dispatch(setErrorMessage('Debe seleccionar al menos una materia'));
        return;
      }

      // Enviar petición al servidor
      await createInscription(data);
      
      // Mostrar mensaje de éxito y navegar a la lista
      dispatch(setSuccessMessage('Inscripción creada exitosamente'));
      navigate('/inscriptions');
    } catch (error) {
      console.error('Error creating inscription:', error);
      dispatch(setErrorMessage('Error al crear la inscripción. Intente nuevamente.'));
    } finally {
      setIsSubmitting(false);
      dispatch(setIsLoading(false));
    }
  }, [dispatch, navigate, isSubmitting]);

  return (
    <div className={className}>
      <BreadcrumbsNav 
        items={[
          { label: 'Inscripciones', path: '/inscriptions' },
          { label: 'Crear Inscripción' }
        ]} 
      />

      <MainCard className="form-card">
        <InscriptionForm 
          onSubmit={handleSubmit} 
        />
      </MainCard>
    </div>
  );
};

interface Props {
  className?: string;
}

export default styled(CreateInscription)`
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
`; 