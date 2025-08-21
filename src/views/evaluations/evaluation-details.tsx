import { Box, Typography, Chip, Grid, Divider, Paper, Button } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { type EvaluationDetails, EvaluationType } from 'core/evaluations/types';

interface EvaluationDetailsProps {
  evaluation: EvaluationDetails;
  onEditClick?: () => void;
}

/**
 * Componente para mostrar los detalles de una evaluación
 */
export default function EvaluationDetails({ evaluation, onEditClick }: EvaluationDetailsProps) {
  // Formato de fecha
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No definida';
    try {
      const date = new Date(dateString);
      return format(date, 'PPP', { locale: es });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
  };

  // Obtener texto del tipo de evaluación
  const getEvaluationType = (type: string) => {
    switch (type) {
      case EvaluationType.PRACTICE:
        return 'Prueba corta';
      case EvaluationType.EXAM:
        return 'Examen';
      case EvaluationType.HOMEWORK:
        return 'Tarea';
      case EvaluationType.PROJECT:
        return 'Proyecto';
      case EvaluationType.LAPSE_EXAM:
        return 'Examen de lapso';
      case EvaluationType.TASK:
        return 'Asignación';
      case EvaluationType.WORKSHOP:
        return 'Taller';
      default:
        return type;
    }
  };

  // Obtener color para el tipo de evaluación
  const getTypeColor = (type: string) => {
    switch (type) {
      case EvaluationType.EXAM:
        return 'primary';
      case EvaluationType.HOMEWORK:
        return 'success';
      case EvaluationType.PROJECT:
        return 'info';
      case EvaluationType.PRACTICE:
        return 'warning';
      case EvaluationType.LAPSE_EXAM:
        return 'error';
      case EvaluationType.TASK:
        return 'secondary';
      case EvaluationType.WORKSHOP:
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 3, boxShadow: 'none' }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box>
          <Typography variant="h3" gutterBottom>
            {evaluation.name}
          </Typography>
          <Box display="flex" gap={2} alignItems="center" mb={1}>
            <Chip
              label={getEvaluationType(evaluation.type)}
              color={getTypeColor(evaluation.type) as any}
              size="small"
            />
            <Typography variant="subtitle1">
              Peso: {evaluation.percentage}%
            </Typography>
            <Typography variant="subtitle1">
              Fecha proyectada: {formatDate(evaluation.projectedDate)}
            </Typography>
          </Box>
        </Box>
        {onEditClick && (
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={onEditClick}
          >
            Editar
          </Button>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        {evaluation.schoolCourt && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Datos del periodo
            </Typography>
            <Box display="flex" gap={3}>
              <Typography variant="body1">
                <strong>Lapso:</strong> {evaluation.schoolCourt.schoolLapse?.lapseNumber || 'No asignado'}
              </Typography>
              <Typography variant="body1">
                <strong>Corte:</strong> {evaluation.schoolCourt.courtNumber}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};
