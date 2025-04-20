import React, { FunctionComponent, useCallback, useState } from 'react';
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
  FormHelperText,
  Chip
} from '@mui/material';
import { Add, Delete, ExpandMore, CalendarToday, Restore } from '@mui/icons-material';
import styled from 'styled-components';
import { SchoolLapseForm, SchoolCourtForm, FormValues } from '../../form/types';
import useLocalLapses from './use-local-lapses';
import CourtsCrud from 'views/school-years/form/courts/courts-crud';
import MainCard from 'components/cards/MainCard';
import { FormikErrors, FormikTouched } from 'formik';

interface Props {
  className?: string;
  lapses: SchoolLapseForm[];
  onChange: (lapses: SchoolLapseForm[]) => void;
  formErrors?: FormikErrors<FormValues>;
  formTouched?: FormikTouched<FormValues>; 
}

const LapsesCrud: FunctionComponent<Props> = ({ 
  className, 
  lapses, 
  onChange,
  formErrors,
  formTouched
}) => {
  // Estado para controlar los errores de validación
  const [lapsesErrors, setLapsesErrors] = useState<{ [key: string]: { startDate?: string; endDate?: string } }>({});

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

  // Función auxiliar para verificar si una fecha es válida
  const isValidDate = (date: string | null | undefined): boolean => {
    return date !== null && date !== undefined && date !== '';
  };

  // Función auxiliar para obtener errores de forma segura
  const getLapseError = (lapseIndex: number, field: string): string | undefined => {
    // Primero revisamos errores locales
    if (lapsesErrors[lapseIndex]?.[field as keyof typeof lapsesErrors[typeof lapseIndex]]) {
      return lapsesErrors[lapseIndex][field as keyof typeof lapsesErrors[typeof lapseIndex]];
    }
    
    // Luego revisamos errores de Formik si están disponibles y el campo ha sido tocado
    if (formErrors?.lapses && 
        Array.isArray(formErrors.lapses) && 
        formErrors.lapses[lapseIndex] && 
        formTouched?.lapses && 
        Array.isArray(formTouched.lapses) && 
        formTouched.lapses[lapseIndex]) {
      
      // Verificamos que el campo específico ha sido tocado
      if (formTouched.lapses[lapseIndex][field as keyof typeof formTouched.lapses[0]]) {
        const error = formErrors.lapses[lapseIndex][field as keyof typeof formErrors.lapses[0]];
        if (typeof error === 'string') {
          return error;
        }
      }
    }
    
    return undefined;
  };

  // Función para comprobar si un campo tiene error
  const hasLapseError = (lapseIndex: number, field: string): boolean => {
    return !!getLapseError(lapseIndex, field);
  };

  const handleAddLapse = useCallback(() => {
    onCreate({
      startDate: '',
      endDate: '',
      schoolCourts: []
    });
  }, [onCreate]);

  const handleUpdateLapse = useCallback((index: number, field: string, value: string) => {
    // Actualizamos el valor
    onUpdate(index, { [field]: value });
    
    // Validamos después de la actualización
    setLapsesErrors(prev => {
      const newErrors = { ...prev };
      const currentLapse = localLapses[index];
      const newValue = field === 'startDate' ? value : currentLapse.startDate;
      const endValue = field === 'endDate' ? value : currentLapse.endDate;
      
      // Validar fecha de inicio
      if (!isValidDate(newValue)) {
        newErrors[index] = { ...newErrors[index], startDate: 'Debes establecer una fecha de inicio' };
      } else {
        // Si hay un valor válido, eliminamos el error
        if (newErrors[index]?.startDate) {
          const { startDate, ...rest } = newErrors[index];
          newErrors[index] = rest;
        }
      }
      
      // Validar fecha de fin
      if (!isValidDate(endValue)) {
        newErrors[index] = { ...newErrors[index], endDate: 'Debes establecer una fecha de fin' };
      } else if (isValidDate(newValue)) {
        // Comparamos las fechas
        const startDate = new Date(newValue);
        const endDate = new Date(endValue);
        
        // Error solo si la fecha de fin es anterior a la de inicio
        if (endDate < startDate) {
          newErrors[index] = { 
            ...newErrors[index], 
            endDate: 'La fecha de fin debe ser mayor o igual a la fecha de inicio' 
          };
        } else {
          // Si hay un valor válido y no hay error de fecha, eliminamos el error
          if (newErrors[index]?.endDate) {
            const { endDate: _, ...rest } = newErrors[index];
            newErrors[index] = rest;
          }
        }
      } else {
        // Si hay un valor válido y no hay error de fecha, eliminamos el error
        if (newErrors[index]?.endDate) {
          const { endDate, ...rest } = newErrors[index];
          newErrors[index] = rest;
        }
      }
      
      return newErrors;
    });
  }, [onUpdate, localLapses]);

  // Devuelve el nombre de clase CSS según el estado del lapso
  const getLapseClassName = useCallback((lapse: SchoolLapseForm) => {
    let className = 'lapse-card';
    if (lapse.localDeleted) className += ' deleted';
    if (lapse.isNew) className += ' new';
    if (lapse.isDirty && !lapse.isNew && !lapse.localDeleted) className += ' modified';
    return className;
  }, []);

  // Componente de acción para el MainCard
  const LapseActionButton = useCallback(() => (
    <Button 
      variant="outlined" 
      color="primary" 
      size="small"
      startIcon={<Add />}
      onClick={handleAddLapse}
      className="add-lapse-button"
    >
      Añadir Lapso
    </Button>
  ), [handleAddLapse]);

  // Función para obtener los errores de los courts para pasar al componente CourtsCrud
  const getCourtErrors = (lapseIndex: number) => {
    if (formErrors?.lapses && 
        Array.isArray(formErrors.lapses) && 
        formErrors.lapses[lapseIndex] && 
        typeof formErrors.lapses[lapseIndex] !== 'string') {
      
      // Hacemos un cast para evitar errores con 'in' operator
      const lapseError = formErrors.lapses[lapseIndex] as Record<string, any>;
      
      if ('schoolCourts' in lapseError && 
          Array.isArray(lapseError.schoolCourts)) {
        return lapseError.schoolCourts as Array<{
          startDate?: string;
          endDate?: string;
        }>;
      }
    }
    return undefined;
  };

  // Función para obtener los touched de los courts para pasar al componente CourtsCrud
  const getCourtTouched = (lapseIndex: number) => {
    if (formTouched?.lapses && 
        Array.isArray(formTouched.lapses) && 
        formTouched.lapses[lapseIndex] && 
        typeof formTouched.lapses[lapseIndex] !== 'string') {
      
      // Hacemos un cast para evitar errores con 'in' operator
      const lapseTouched = formTouched.lapses[lapseIndex] as Record<string, any>;
      
      if ('schoolCourts' in lapseTouched && 
          Array.isArray(lapseTouched.schoolCourts)) {
        return lapseTouched.schoolCourts as Array<{
          startDate?: boolean;
          endDate?: boolean;
        }>;
      }
    }
    return undefined;
  };

  return (
    <div className={className}>
      <MainCard 
        className={'form-data'} 
        title={'Gestión de lapsos'}
        secondary={<LapseActionButton />}
      >
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
                        <span className="id-label" title="Sin ID (se creará al guardar)">(Sin Id)</span>
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
                        <FormControl className="field-form" fullWidth error={hasLapseError(index, 'startDate')}>
                          <TextField
                            label="Fecha de Inicio"
                            type="date"
                            value={lapse.startDate || ''}
                            onChange={(e) => handleUpdateLapse(index, 'startDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              className: 'input-field',
                              startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
                            }}
                            error={hasLapseError(index, 'startDate')}
                          />
                          {hasLapseError(index, 'startDate') && (
                            <FormHelperText error>{getLapseError(index, 'startDate')}</FormHelperText>
                          )}
                        </FormControl>

                        <FormControl className="field-form" fullWidth error={hasLapseError(index, 'endDate')}>
                          <TextField
                            label="Fecha de Fin"
                            type="date"
                            value={lapse.endDate || ''}
                            onChange={(e) => handleUpdateLapse(index, 'endDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              className: 'input-field',
                              startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
                            }}
                            error={hasLapseError(index, 'endDate')}
                          />
                          {hasLapseError(index, 'endDate') && (
                            <FormHelperText error>{getLapseError(index, 'endDate')}</FormHelperText>
                          )}
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
                        formErrors={getCourtErrors(index)}
                        formTouched={getCourtTouched(index)}
                      />
                    </AccordionDetails>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </MainCard>
    </div>
  );
};

export default styled(LapsesCrud)`
  width: 100%;
  
  .form-data {
    margin-top: 16px;
  }
  
  .lapses-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 20px;
  }

  .add-lapse-button {
    margin-left: auto;
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

    &:before {
      display: none;
    }
  }

  .lapse-header {
    padding: 12px 16px;
    background-color: #f5f5f5;
    display: flex;
    min-height: inherit;
    margin: 0px;

    div {
      margin: 0px;
    }

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
    font-weight: 500;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .lapse-actions {
    display: flex;
    align-items: center;
    margin-right: 8px;
  }

  .status-chip, .new-item-indicator {
    margin-left: 8px;
    height: 24px;
    
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

  .id-label {
    font-size: 0.8rem;
    color: #757575;
    margin-left: 8px;
  }

  .no-id-icon {
    font-size: 1rem;
    margin-left: 8px;
  }

  .lapse-details {
    padding: 16px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 8px;
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

  .delete-button {
    color: #f44336;
  }

  .restore-button {
    color: #2196f3;
  }

  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
`; 
