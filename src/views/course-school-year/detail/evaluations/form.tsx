import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface EvaluationFormDialogProps {
  isOpen: boolean;
  isEditMode: boolean;
  onCancel: () => void;
  handleSubmit: () => void;
}

const EvaluationFormDialog: React.FC<EvaluationFormDialogProps> = ({ isOpen, isEditMode, onCancel, handleSubmit }) => {
  return (
    <Dialog open={isOpen} onClose={onCancel} aria-labelledby="evaluation-form-dialog-title">
      <DialogTitle id="evaluation-form-dialog-title">
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          {isEditMode ? 'Editar Evaluación' : 'Nueva Evaluación'}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {/* Aquí irían los campos del formulario */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined" color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="outlined" color="primary">
          {isEditMode ? 'Guardar Cambios' : 'Crear Evaluación'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EvaluationFormDialog;