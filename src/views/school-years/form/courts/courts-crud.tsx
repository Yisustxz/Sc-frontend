import React, { FunctionComponent } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  IconButton,
  Paper,
  TextField,
  FormControl,
  Chip
} from '@mui/material';
import { Add, Delete, CalendarToday, Restore } from '@mui/icons-material';
import styled from 'styled-components';
import { SchoolCourtForm } from '../../form';

interface Props {
  className?: string;
  courts: SchoolCourtForm[];
  onUpdate: (courtIndex: number, updatedCourt: Partial<SchoolCourtForm>) => void;
  onCreate: (court: SchoolCourtForm) => void;
  onDelete: (courtIndex: number) => void;
  onRevertDelete: (courtIndex: number) => void;
}

const CourtsCrud: FunctionComponent<Props> = ({ 
  className, 
  courts, 
  onUpdate, 
  onCreate, 
  onDelete,
  onRevertDelete
}) => {
  const handleAddCourt = () => {
    onCreate({
      startDate: '',
      endDate: ''
    });
  };

  const handleUpdateCourt = (index: number, field: string, value: string) => {
    onUpdate(index, { [field]: value });
  };

  // Devuelve el nombre de clase CSS según el estado del corte
  const getCourtClassName = (court: SchoolCourtForm) => {
    let className = 'court-card';
    if (court.localDeleted) className += ' deleted';
    if (court.isNew) className += ' new';
    if (court.isDirty && !court.isNew && !court.localDeleted) className += ' modified';
    return className;
  };

  return (
    <div className={className}>
      <Box className="courts-header">
        <Typography variant="subtitle1" className="courts-title">
          Cortes Académicos
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleAddCourt}
          size="small"
        >
          Añadir Corte
        </Button>
      </Box>

      <div className="courts-list">
        {courts.map((court, index) => (
          <Paper 
            key={index} 
            elevation={1} 
            className={getCourtClassName(court)}
          >
            <Box className="court-header">
              <Typography variant="subtitle2" className="court-title">
                Corte #{index + 1}
                {court.courtId ? (
                  <span className="id-label">(ID: {court.courtId})</span>
                ) : (
                  <span className="no-id-icon" title="Sin ID (se creará al guardar)">🆕</span>
                )}
                {court.localDeleted && (
                  <Chip 
                    label="Eliminado" 
                    size="small" 
                    color="error" 
                    variant="outlined"
                    className="status-chip deleted-chip"
                  />
                )}
                {court.isNew && !court.localDeleted && (
                  <Chip 
                    label="Nuevo" 
                    size="small" 
                    color="success" 
                    variant="outlined"
                    className="status-chip new-chip"
                  />
                )}
                {court.isDirty && !court.isNew && !court.localDeleted && (
                  <Chip 
                    label="Modificado" 
                    size="small" 
                    color="warning" 
                    variant="outlined"
                    className="status-chip modified-chip"
                  />
                )}
              </Typography>
              
              <Box className="court-actions">
                {court.localDeleted ? (
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
            </Box>

            {!court.localDeleted && (
              <Box className="court-content">
                <div className="court-form">
                  <FormControl className="field-form" fullWidth>
                    <TextField
                      label="Fecha de Inicio"
                      type="date"
                      size="small"
                      value={court.startDate}
                      onChange={(e) => handleUpdateCourt(index, 'startDate', e.target.value)}
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
                      size="small"
                      value={court.endDate}
                      onChange={(e) => handleUpdateCourt(index, 'endDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        className: 'input-field',
                        startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
                      }}
                    />
                  </FormControl>
                </div>
              </Box>
            )}
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default styled(CourtsCrud)`
  .courts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 8px;
  }

  .courts-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .court-card {
    border-radius: 6px;
    overflow: hidden;
    
    &.deleted {
      opacity: 0.6;
      background-color: #ffecec;
    }

    &.new {
      border: 1px solid #4caf50;
      background-color: #f1f8e9;
    }

    &.modified {
      border: 1px solid #ff9800;
      background-color: #fff8e1;
    }
  }

  .court-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: #f9f9f9;
    border-bottom: 1px solid #eaeaea;

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

  .court-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .status-chip {
    margin-left: 8px;
    height: 20px;
    font-size: 0.75rem;
  }

  .court-content {
    padding: 12px;
  }

  .court-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .calendar-icon {
    margin-right: 8px;
    color: rgba(0, 0, 0, 0.54);
    font-size: 16px;
  }

  .id-label {
    margin-left: 8px;
    font-size: 0.75rem;
    color: #666;
    font-weight: normal;
  }

  .no-id-icon {
    margin-left: 8px;
    font-size: 0.75rem;
  }

  @media (max-width: 600px) {
    .court-form {
      grid-template-columns: 1fr;
    }
  }
`; 