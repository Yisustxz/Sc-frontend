import { FunctionComponent } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Typography,
  Box,
  Chip
} from '@mui/material';
import { IconPencil, IconTrash } from '@tabler/icons';
import { EvaluationListProps } from './types';
import { EvaluationType } from 'core/evaluations/types';

const EvaluationList: FunctionComponent<EvaluationListProps> = ({
  evaluations,
  onEditEvaluation,
  onDeleteEvaluation
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
      case EvaluationType.Exam:
        return 'primary';
      case EvaluationType.Task:
        return 'success';
      case EvaluationType.Project:
        return 'warning';
      case EvaluationType.Homework:
        return 'info';
      case EvaluationType.Workshop:
        return 'secondary';
      case EvaluationType.Practice:
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <List dense>
      {evaluations.map((evaluation) => (
        <ListItem key={evaluation.id} divider>
          <ListItemText 
            primary={
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body1">{evaluation.name}</Typography>
                <Chip 
                  label={evaluation.type} 
                  size="small" 
                  color={getChipColor(evaluation.type)} 
                  variant="outlined"
                />
              </Box>
            } 
            secondary={`Peso: ${evaluation.percentage}%`} 
          />
          <ListItemSecondaryAction>
            {onEditEvaluation && (
              <IconButton 
                edge="end" 
                aria-label="editar" 
                onClick={() => onEditEvaluation(evaluation.id, evaluation)}
                size="small"
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