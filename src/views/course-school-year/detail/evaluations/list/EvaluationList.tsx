import { FunctionComponent } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Typography,
  Box,
  Chip,
  Stack
} from '@mui/material';
import { IconPencil, IconTrash, IconCalendar, IconEye } from '@tabler/icons';
import { EvaluationListProps } from '../types';
import { EvaluationType } from 'core/evaluations/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const EvaluationList: FunctionComponent<EvaluationListProps> = ({
  evaluations,
  onEditEvaluation,
  onDeleteEvaluation,
  onViewEvaluation
}) => {
  // Si no hay evaluaciones, mostrar un mensaje
  if (evaluations.length === 0) {
    return (
      <Box p={2} textAlign="center">
        <Typography variant="body2" color="textSecondary">
          No hay evaluaciones para este corte
        </Typography>
      </Box>
    );
  }

  // Obtener el color del chip según el tipo de evaluación
  const getChipColor = (type: EvaluationType) => {
    switch (type) {
      case EvaluationType.EXAM:
        return 'primary';
      case EvaluationType.TASK:
        return 'success';
      case EvaluationType.PROJECT:
        return 'warning';
      case EvaluationType.HOMEWORK:
        return 'info';
      case EvaluationType.WORKSHOP:
        return 'secondary';
      case EvaluationType.PRACTICE:
        return 'default';
      case EvaluationType.LAPSE_EXAM:
        return 'error';
      default:
        return 'default';
    }
  };

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return null;
    }
  };

  return (
    <List dense>
      {evaluations.map((evaluation: any) => (
        <ListItem key={evaluation.id} divider>
          <ListItemText 
            primary={
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body1">
                  {evaluation.name}
                  {evaluation.correlative && (
                    <Typography component="span" color="primary" sx={{ ml: 0.5, fontWeight: 'bold' }}>
                      #{evaluation.correlative}
                    </Typography>
                  )}
                </Typography>
                <Chip 
                  label={evaluation.type} 
                  size="small" 
                  color={getChipColor(evaluation.type)} 
                  variant="outlined"
                />
              </Box>
            } 
            secondary={
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">
                  Peso: {evaluation.percentage}%
                </Typography>
                {evaluation.projectedDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                    <IconCalendar size="0.9rem" style={{ marginRight: '2px' }} />
                    <Typography variant="caption">
                      {formatDate(evaluation.projectedDate)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            } 
          />
          <ListItemSecondaryAction>
            {onViewEvaluation && (
              <IconButton 
                edge="end" 
                aria-label="ver detalle" 
                onClick={() => onViewEvaluation(evaluation.id)}
                size="small"
              >
                <IconEye size="1.1rem" />
              </IconButton>
            )}
            {onEditEvaluation && (
              <IconButton 
                edge="end" 
                aria-label="editar" 
                onClick={() => onEditEvaluation(evaluation.id, evaluation)}
                size="small"
                sx={{ ml: 1 }}
              >
                <IconPencil size="1.1rem" />
              </IconButton>
            )}
            {onDeleteEvaluation && (
              <IconButton 
                edge="end" 
                aria-label="eliminar" 
                onClick={() => onDeleteEvaluation(evaluation.id)}
                size="small"
                sx={{ ml: 1 }}
              >
                <IconTrash size="1.1rem" />
              </IconButton>
            )}
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default EvaluationList; 