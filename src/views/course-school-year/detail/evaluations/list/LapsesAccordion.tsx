import { FunctionComponent } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { LapsesAccordionProps } from '../types';
import LapseItem from './LapseItem';

const LapsesAccordion: FunctionComponent<LapsesAccordionProps> = ({
  schoolYear,
  evaluations,
  onAddEvaluation,
  onEditEvaluation,
  onDeleteEvaluation,
  onViewEvaluation,
  setLapseExpanded,
  setCourtExpanded
}) => {
  // Si no hay lapsos, mostrar un mensaje
  if (!schoolYear.schoolLapses || schoolYear.schoolLapses.length === 0) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          No hay lapsos configurados para este año escolar
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {schoolYear.schoolLapses.map((lapse, index) => (
          <LapseItem
            key={lapse.id + '-lapse-item'}
            schoolLapse={lapse}
            evaluations={evaluations}
            lapseIndex={index}
            onAddEvaluation={onAddEvaluation}
            onEditEvaluation={onEditEvaluation}
            onDeleteEvaluation={onDeleteEvaluation}
            onViewEvaluation={onViewEvaluation}
            setLapseExpanded={setLapseExpanded}
            setCourtExpanded={setCourtExpanded}
          />
      ))}
    </Box>
  );
};

export default LapsesAccordion;
