import React, { FunctionComponent } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControl,
  Chip
} from '@mui/material';
import { Add, Delete, ExpandMore, CalendarToday, Restore } from '@mui/icons-material';
import styled from 'styled-components';
import { SchoolLapseForm, SchoolCourtForm } from '../../form';
import useLocalLapses from './use-local-lapses';
import CourtsCrud from 'views/school-years/form/courts/courts-crud';

interface Props {
  className?: string;
  lapses: SchoolLapseForm[];
  onChange: (lapses: SchoolLapseForm[]) => void;
}

const LapsesCrud: FunctionComponent<Props> = ({ className, lapses, onChange }) => {
  const {
    localLapses,
    onDelete,
    onRevertDelete,
    onUpdate,
    onCreate,
    onUpdateCourt,
    onCreateCourt,
    onDeleteCourt,
    onRevertDeleteCourt
  } = useLocalLapses(lapses, onChange);

  const handleAddLapse = () => {
    onCreate({
      startDate: '',
      endDate: '',
      schoolCourts: []
    });
  };

  const handleUpdateLapse = (index: number, field: string, value: string) => {
    onUpdate(index, { [field]: value });
  };

  // Devuelve el nombre de clase CSS según el estado del lapso
  const getLapseClassName = (lapse: SchoolLapseForm) => {
    let className = 'lapse-card';
    if (lapse.localDeleted) className += ' deleted';
    if (lapse.isNew) className += ' new';
    if (lapse.isDirty && !lapse.isNew && !lapse.localDeleted) className += ' modified';
    return className;
  };

  return (
    <div className={className}>
      <Box className="lapses-header">
        <Typography variant="h5">Lapsos Académicos</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleAddLapse}
        >
          Añadir Lapso
        </Button>
      </Box>

      <div className="lapses-list">
        {localLapses.map((lapse, index) => (
          <Card 
            key={index} 
            className={getLapseClassName(lapse)}
          >
            <CardContent className="lapse-content">
              <Accordion defaultExpanded className="lapse-accordion">
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  className="lapse-header"
                >
                  <Typography variant="h6" className="lapse-title">
                    Lapso #{index + 1}
                    {lapse.lapseId ? (
                      <span className="id-label">(ID: {lapse.lapseId})</span>
                    ) : (
                      <span className="no-id-icon" title="Sin ID (se creará al guardar)">🆕</span>
                    )}
                    {lapse.localDeleted && (
                      <Chip 
                        label="Eliminado" 
                        size="small" 
                        color="error" 
                        variant="outlined"
                        className="status-chip deleted-chip"
                      />
                    )}
                    {lapse.isNew && !lapse.localDeleted && (
                      <Chip 
                        label="Nuevo" 
                        size="small" 
                        color="success" 
                        variant="outlined"
                        className="status-chip new-chip"
                      />
                    )}
                    {lapse.isDirty && !lapse.isNew && !lapse.localDeleted && (
                      <Chip 
                        label="Modificado" 
                        size="small" 
                        color="warning" 
                        variant="outlined"
                        className="status-chip modified-chip"
                      />
                    )}
                  </Typography>
                  <Box className="lapse-actions">
                    {lapse.localDeleted ? (
                      <IconButton
                        color="primary"
                        onClick={() => onRevertDelete(index)}
                        size="small"
                        className="restore-button"
                        title="Restaurar"
                      >
                        <Restore fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="error"
                        onClick={() => onDelete(index)}
                        size="small"
                        className="delete-button"
                        title="Eliminar"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </AccordionSummary>

                {!lapse.localDeleted && (
                  <AccordionDetails className="lapse-details">
                    <div className="form-grid">
                      <FormControl className="field-form" fullWidth>
                        <TextField
                          label="Fecha de Inicio"
                          type="date"
                          value={lapse.startDate}
                          onChange={(e) => handleUpdateLapse(index, 'startDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            className: 'input-field',
                            startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
                          }}
                        />
                      </FormControl>

                      <FormControl className="field-form" fullWidth>
                        <TextField
                          label="Fecha de Fin"
                          type="date"
                          value={lapse.endDate}
                          onChange={(e) => handleUpdateLapse(index, 'endDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            className: 'input-field',
                            startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
                          }}
                        />
                      </FormControl>
                    </div>

                    <CourtsCrud 
                      courts={lapse.schoolCourts}
                      onUpdate={(courtIndex: number, updatedCourt: Partial<SchoolCourtForm>) => 
                        onUpdateCourt(index, courtIndex, updatedCourt)
                      }
                      onCreate={(court: SchoolCourtForm) => onCreateCourt(index, court)}
                      onDelete={(courtIndex: number) => onDeleteCourt(index, courtIndex)}
                      onRevertDelete={(courtIndex: number) => 
                        onRevertDeleteCourt(index, courtIndex)
                      }
                    />
                  </AccordionDetails>
                )}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default styled(LapsesCrud)`
  .lapses-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .lapses-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .lapse-card {
    border-radius: 8px;
    overflow: hidden;

    &.deleted {
      opacity: 0.6;
      background-color: #ffecec;
    }

    &.new {
      border: 2px solid #4caf50;
      background-color: #f1f8e9;
    }

    &.modified {
      border: 2px solid #ff9800;
      background-color: #fff8e1;
    }
  }

  .lapse-content {
    padding: 0;
  }

  .lapse-accordion {
    box-shadow: none;
  }

  .lapse-header {
    padding: 12px 16px;
    background-color: #f5f5f5;

    .deleted & {
      background-color: #ffebee;
    }
    
    .new & {
      background-color: #e8f5e9;
    }
    
    .modified & {
      background-color: #fff3e0;
    }
  }

  .lapse-title {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }

  .status-chip {
    margin-left: 12px;
    height: 24px;
    font-size: 0.75rem;
  }

  .lapse-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .lapse-details {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .calendar-icon {
    margin-right: 8px;
    color: rgba(0, 0, 0, 0.54);
  }

  .id-label {
    margin-left: 8px;
    font-size: 0.75rem;
    color: #666;
    font-weight: normal;
  }

  .no-id-icon {
    margin-left: 8px;
    font-size: 0.85rem;
  }

  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
`; 