import { FunctionComponent } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { IconPlus } from '@tabler/icons';
import { LapsesAccordionProps } from './types';
import LapseItem from './LapseItem';

const LapsesAccordion: FunctionComponent<LapsesAccordionProps> = ({
  schoolYear,
  evaluations,
  onAddEvaluation,
  onEditEvaluation,
  onDeleteEvaluation
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
          key={lapse.id || index}
          schoolLapse={lapse}
          evaluations={evaluations}
          lapseIndex={index}
          onAddEvaluation={onAddEvaluation}
          onEditEvaluation={onEditEvaluation}
          onDeleteEvaluation={onDeleteEvaluation}
        />
      ))}
    </Box>
  );
};

export default LapsesAccordion;
