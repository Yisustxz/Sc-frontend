import { FunctionComponent, useState, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider
} from '@mui/material';
import { IconX } from '@tabler/icons';
import { EvaluationModalProps } from './types';
import EvaluationForm from './form';
import { EvaluationFormData } from './types';
import { EvaluationType } from 'core/evaluations/types';

const EvaluationModal: FunctionComponent<EvaluationModalProps> = ({
  open,
  onClose,
  onSave,
  evaluation,
  schoolCourtId,
  courseSchoolYearId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determinar si estamos en modo actualización
  const isUpdateMode = useMemo(() => !!evaluation?.id, [evaluation]);

  // Título del modal según el modo
  const modalTitle = useMemo(() => (
    isUpdateMode ? "Editar Evaluación" : "Agregar Evaluación"
  ), [isUpdateMode]);

  // Valores iniciales para el formulario
  const initialValues = useMemo(() => ({
    id: evaluation?.id,
    name: evaluation?.name || '',
    schoolCourtId: evaluation?.schoolCourtId || schoolCourtId || 0,
    percentage: evaluation?.percentage || 10,
    type: evaluation?.type || EvaluationType.Task,
    courseSchoolYearId: evaluation?.courseSchoolYearId || courseSchoolYearId,
    correlative: evaluation?.correlative,
    projectedDate: evaluation?.projectedDate
  }), [evaluation, schoolCourtId, courseSchoolYearId]);

  // Manejar el guardado de evaluación
  const handleSave = useCallback(async (formData: EvaluationFormData) => {
    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }, [onSave, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="evaluation-modal-title"
    >
      <DialogTitle id="evaluation-modal-title">
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {modalTitle}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <EvaluationForm
          initialValues={initialValues as EvaluationFormData}
          onSubmit={handleSave}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          size="small"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          form="evaluation-form"
          variant="outlined"
          color="primary"
          size="small"
          disabled={isSubmitting}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EvaluationModal;