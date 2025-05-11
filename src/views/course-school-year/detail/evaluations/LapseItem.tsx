import { FunctionComponent, useState } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Box 
} from '@mui/material';
import { IconChevronDown } from '@tabler/icons';
import { LapseItemProps } from './types';
import CourtItem from './CourtItem';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const LapseItem: FunctionComponent<LapseItemProps> = ({
  schoolLapse,
  evaluations,
  lapseIndex,
  onAddEvaluation,
  onEditEvaluation,
  onDeleteEvaluation
}) => {
  const [expanded, setExpanded] = useState(lapseIndex === 0); // Primer lapso expandido por defecto

  // Formatear rango de fechas
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = format(new Date(startDate), 'dd MMM yyyy', { locale: es });
    const end = format(new Date(endDate), 'dd MMM yyyy', { locale: es });
    return `${start} - ${end}`;
  };

  return (
    <Accordion 
      expanded={expanded} 
      onChange={() => setExpanded(!expanded)}
      sx={{ mb: 1 }}
    >
      <AccordionSummary
        expandIcon={<IconChevronDown />}
        aria-controls={`lapse-${lapseIndex}-content`}
        id={`lapse-${lapseIndex}-header`}
      >
        <Typography variant="subtitle1">
          Lapso {lapseIndex + 1}: {formatDateRange(schoolLapse.startDate, schoolLapse.endDate)}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {schoolLapse.schoolCourts.map((court, courtIndex) => (
          <CourtItem
            key={court.id || courtIndex}
            schoolCourt={court}
            evaluations={evaluations}
            lapseIndex={lapseIndex}
            courtIndex={courtIndex}
            onAddEvaluation={onAddEvaluation}
            onEditEvaluation={onEditEvaluation}
            onDeleteEvaluation={onDeleteEvaluation}
          />
        ))}
        {schoolLapse.schoolCourts.length === 0 && (
          <Box p={2}>
            <Typography variant="body2" color="textSecondary">
              No hay cortes en este lapso
            </Typography>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default LapseItem; 