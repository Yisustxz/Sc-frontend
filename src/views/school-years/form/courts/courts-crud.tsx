import React, { FunctionComponent, useCallback, useState } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  IconButton,
  Paper,
  TextField,
  FormControl,
  FormHelperText,
  Chip
} from '@mui/material';
import { Add, Delete, CalendarToday, Restore } from '@mui/icons-material';
import styled from 'styled-components';
import { SchoolCourtForm } from '../../form/types';
import { FormikErrors, FormikTouched } from 'formik';

interface Props {
  className?: string;
  courts: SchoolCourtForm[];
  onUpdate: (courtIndex: number, updatedCourt: Partial<SchoolCourtForm>) => void;
  onCreate: (court: SchoolCourtForm) => void;
  onDelete: (courtIndex: number) => void;
  onRevertDelete: (courtIndex: number) => void;
  formErrors?: FormikErrors<SchoolCourtForm>[];
  formTouched?: FormikTouched<SchoolCourtForm>[];
}

const CourtsCrud: FunctionComponent<Props> = ({ 
  className, 
  courts, 
  onUpdate, 
  onCreate, 
  onDelete,
  onRevertDelete,
  formErrors,
  formTouched
}) => {
  // Estado para gestionar errores de validación
  const [courtsErrors, setCourtsErrors] = useState<{
    startDate?: string;
    endDate?: string;
  }[]>(courts.map(() => ({})));

  // Función auxiliar para verificar si una fecha es válida
  const isValidDate = (date: string | null | undefined): boolean => {
    return date !== null && date !== undefined && date !== '';
  };

  const handleAddCourt = useCallback(() => {
    onCreate({
      startDate: '',
      endDate: ''
    });
    // Agregar un nuevo objeto de errores vacío al array
    setCourtsErrors(prev => [...prev, {}]);
  }, [onCreate]);

  const handleUpdateCourt = useCallback((index: number, field: string, value: string) => {
    onUpdate(index, { [field]: value });

    // Validar fechas cuando se actualiza un campo
    const newErrors = [...courtsErrors];
    const court = courts[index];

    if (field === 'startDate') {
      // Validar fecha de inicio
      if (!isValidDate(value)) {
        newErrors[index] = { ...newErrors[index], startDate: 'Debes establecer una fecha de inicio' };
      } else {
        // Si hay un valor válido, eliminamos el error
        if (newErrors[index]?.startDate) {
          const { startDate, ...rest } = newErrors[index];
          newErrors[index] = rest;
        }

        // Validar que la fecha de fin sea posterior a la fecha de inicio si ya existe
        if (isValidDate(court.endDate) && new Date(value) >= new Date(court.endDate)) {
          newErrors[index] = { 
            ...newErrors[index], 
            endDate: 'La fecha de fin debe ser posterior a la fecha de inicio' 
          };
        } else if (newErrors[index]?.endDate && isValidDate(court.endDate)) {
          // Si hay un valor válido y no hay error de fecha, eliminamos el error
          const { endDate, ...rest } = newErrors[index];
          newErrors[index] = rest;
        }
      }
    }

    if (field === 'endDate') {
      // Validar fecha de fin
      if (!isValidDate(value)) {
        newErrors[index] = { ...newErrors[index], endDate: 'Debes establecer una fecha de fin' };
      } else if (isValidDate(court.startDate) && new Date(value) <= new Date(court.startDate)) {
        newErrors[index] = { 
          ...newErrors[index], 
          endDate: 'La fecha de fin debe ser posterior a la fecha de inicio' 
        };
      } else {
        // Si hay un valor válido y no hay error de fecha, eliminamos el error
        if (newErrors[index]?.endDate) {
          const { endDate, ...rest } = newErrors[index];
          newErrors[index] = rest;
        }
      }
    }

    setCourtsErrors(newErrors);
  }, [onUpdate, courts, courtsErrors]);

  // Devuelve el nombre de clase CSS según el estado del corte
  const getCourtClassName = useCallback((court: SchoolCourtForm) => {
    let className = 'court-card';
    if (court.localDeleted) className += ' deleted';
    if (court.isNew) className += ' new';
    if (court.isDirty && !court.isNew && !court.localDeleted) className += ' modified';
    return className;
  }, []);

  return (
    <div className={className}>
      <Box className="courts-header">
        <Typography variant="subtitle1" className="courts-title">
          Cortes Académicos
        </Typography>
        <Button 
          variant="text" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleAddCourt}
          size="small"
          className="add-court-button"
        >
          Añadir
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
                  <span className="id-label" title="Sin ID (se creará al guardar)">(Sin Id)</span>
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
                  >
                    <Restore fontSize="small" />
                  </IconButton>
                ) : (
                  <IconButton
                    color="error"
                    onClick={() => onDelete(index)}
                    size="small"
                    className="delete-button"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>

            {!court.localDeleted && (
              <Box className="court-content">
                <div className="court-form-grid">
                  <FormControl className="field-form" fullWidth error={!!courtsErrors[index]?.startDate || !!(formErrors?.[index]?.startDate && formTouched?.[index]?.startDate)}>
                    <TextField
                      label="Fecha de Inicio"
                      type="date"
                      size="small"
                      value={court.startDate || ''}
                      onChange={(e) => handleUpdateCourt(index, 'startDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        className: 'input-field',
                        startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
                      }}
                      error={!!courtsErrors[index]?.startDate || !!(formErrors?.[index]?.startDate && formTouched?.[index]?.startDate)}
                    />
                    {(courtsErrors[index]?.startDate || (formErrors?.[index]?.startDate && formTouched?.[index]?.startDate)) && (
                      <FormHelperText>{typeof courtsErrors[index]?.startDate === 'string' ? courtsErrors[index]?.startDate : typeof formErrors?.[index]?.startDate === 'string' ? formErrors[index].startDate : ''}</FormHelperText>
                    )}
                  </FormControl>

                  <FormControl className="field-form" fullWidth error={!!courtsErrors[index]?.endDate || !!(formErrors?.[index]?.endDate && formTouched?.[index]?.endDate)}>
                    <TextField
                      label="Fecha de Fin"
                      type="date"
                      size="small"
                      value={court.endDate || ''}
                      onChange={(e) => handleUpdateCourt(index, 'endDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        className: 'input-field',
                        startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
                      }}
                      error={!!courtsErrors[index]?.endDate || !!(formErrors?.[index]?.endDate && formTouched?.[index]?.endDate)}
                    />
                    {(courtsErrors[index]?.endDate || (formErrors?.[index]?.endDate && formTouched?.[index]?.endDate)) && (
                      <FormHelperText>{typeof courtsErrors[index]?.endDate === 'string' ? courtsErrors[index]?.endDate : typeof formErrors?.[index]?.endDate === 'string' ? formErrors[index].endDate : ''}</FormHelperText>
                    )}
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

  .courts-title {
    font-weight: 500;
  }

  .add-court-button {
    margin-left: auto;
  }

  .courts-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-left: 16px;
  }

  .court-card {
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
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
    
    &.deleted-chip {
      border-color: #f44336;
      color: #f44336;
    }
    
    &.new-chip {
      border-color: #4caf50;
      color: #4caf50;
    }
    
    &.modified-chip {
      border-color: #ff9800;
      color: #ff9800;
    }
  }

  .court-actions {
    display: flex;
    align-items: center;
  }

  .court-content {
    padding: 12px;
  }

  .court-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .field-form {
    margin-bottom: 8px;
  }

  .calendar-icon {
    margin-right: 8px;
    color: rgba(0, 0, 0, 0.54);
  }

  .input-field {
    background-color: #f8f9fa;
  }

  .id-label {
    font-size: 0.75rem;
    color: #757575;
    margin-left: 8px;
  }

  .no-id-icon {
    font-size: 0.9rem;
    margin-left: 8px;
  }

  .delete-button {
    color: #f44336;
  }

  .restore-button {
    color: #2196f3;
  }

  @media (max-width: 600px) {
    .court-form-grid {
      grid-template-columns: 1fr;
    }
  }
`; 