import { FunctionComponent, useCallback, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Divider, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails 
} from '@mui/material';
import { IconPlus, IconChevronDown } from '@tabler/icons';
import { CourtItemProps } from '../types';
import EvaluationList from './EvaluationList';
import { Evaluation, EvaluationType } from 'core/evaluations/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const CourtItem: FunctionComponent<CourtItemProps> = ({
  schoolCourt,
  evaluations,
  lapseIndex,
  courtIndex,
  onAddEvaluation,
  onEditEvaluation,
  onDeleteEvaluation,
  onViewEvaluation,
  setCourtExpanded
}) => {
  // Manejar cambio en la expansión del acordeón
  const handleExpandChange = () => {
    // Notificar al componente padre para actualizar el estado
    if (setCourtExpanded && schoolCourt.id) {
      setCourtExpanded(schoolCourt.id, !schoolCourt.isExpanded);
    }
  };

  // Filtrar evaluaciones para este corte específico
  const courtEvaluations = useMemo(() => {
    return evaluations.filter(evaluation => evaluation.schoolCourtId === schoolCourt.id);
  }, [evaluations, schoolCourt.id]);

  // Formatear rango de fechas
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = format(new Date(startDate), 'dd MMM yyyy', { locale: es });
    const end = format(new Date(endDate), 'dd MMM yyyy', { locale: es });
    return `${start} - ${end}`;
  };
  
  // Manejar clic en agregar evaluación
  const handleAddClick = useCallback(() => {
    if (onAddEvaluation) {
      onAddEvaluation({
        schoolCourtId: schoolCourt.id,
        type: EvaluationType.TASK,
        percentage: 10,
        name: `Nueva Evaluación`
      });
    }

    // Expandir automáticamente cuando se agrega una evaluación
    if (!schoolCourt.isExpanded && setCourtExpanded && schoolCourt.id) {
      setCourtExpanded(schoolCourt.id, true);
    }
  }, [onAddEvaluation, schoolCourt.id, schoolCourt.isExpanded, setCourtExpanded]);

  return (
    <Accordion 
      expanded={schoolCourt.isExpanded || false} 
      onChange={handleExpandChange}
      sx={{ mb: 1, ml: 2 }}
    >
      <AccordionSummary
        expandIcon={<IconChevronDown />}
        aria-controls={`court-${courtIndex}-content`}
        id={`court-${courtIndex}-header`}
        sx={{ 
          backgroundColor: schoolCourt.isExpanded ? 'rgba(0, 0, 0, 0.03)' : 'transparent',
          '& .MuiAccordionSummary-content': {
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexGrow: 1
          }
        }}
      >
        <Typography variant="subtitle2">
          Corte {courtIndex + 1}: {formatDateRange(schoolCourt.startDate, schoolCourt.endDate)}
        </Typography>
        <Box 
          onClick={(e) => e.stopPropagation()} 
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {courtEvaluations.length > 0 && (
            <Typography variant="caption" color="textSecondary" sx={{ mr: 1 }}>
              {courtEvaluations.length} evaluación(es)
            </Typography>
          )}
          {onAddEvaluation && (
            <Button
              size="small"
              startIcon={<IconPlus size="1rem" />}
              onClick={(e) => {
                e.stopPropagation();
                handleAddClick();
              }}
              variant="outlined"
            >
              Agregar
            </Button>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <EvaluationList
          evaluations={courtEvaluations}
          onEditEvaluation={onEditEvaluation}
          onDeleteEvaluation={onDeleteEvaluation}
          onViewEvaluation={onViewEvaluation}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default CourtItem; 