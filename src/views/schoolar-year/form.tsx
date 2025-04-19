import { FunctionComponent } from 'react'
import * as Yup from 'yup'
import { Formik, FormikHelpers, FieldArray } from 'formik'
import MainCard from 'components/cards/MainCard'
import {
  Button,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
  IconButton,
  Card,
  CardContent,
  Divider,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper
} from '@mui/material'
import { Delete, Add, Edit, ExpandMore, CalendarToday } from '@mui/icons-material'
import styled from 'styled-components'

const Form: FunctionComponent<Props> = ({
  className,
  title,
  onSubmit,
  initialValues,
  isUpdate
}) => {
  return (
    <div className={className}>
      <Formik
        validateOnChange={true}
        validateOnBlur={false}
        validateOnMount={false}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          code: Yup.string()
            .max(10, 'El código no puede tener más de 10 caracteres')
            .required('El código es requerido'),
          startDate: Yup.date().required('La fecha de inicio es requerida'),
          endDate: Yup.date()
            .required('La fecha de fin es requerida')
            .min(
              Yup.ref('startDate'),
              'La fecha de fin no puede ser anterior a la fecha de inicio'
            )
        })}
        onSubmit={onSubmit as any}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <MainCard className={'form-data'} title={title}>
              <div className='form-grid'>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='code'
                    label='Código'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.code}
                    helperText={touched.code ? errors.code : ''}
                    error={touched.code && !!errors.code}
                    name='code'
                    inputProps={{ maxLength: 10 }}
                    InputProps={{
                      className: 'input-field'
                    }}
                  />
                </FormControl>

                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='startDate'
                    label='Fecha de Inicio'
                    variant='outlined'
                    type='date'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.startDate}
                    helperText={touched.startDate ? errors.startDate : ''}
                    error={touched.startDate && !!errors.startDate}
                    name='startDate'
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{
                      className: 'input-field',
                      startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
                    }}
                  />
                </FormControl>

                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='endDate'
                    label='Fecha de Fin'
                    variant='outlined'
                    type='date'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.endDate}
                    helperText={touched.endDate ? errors.endDate : ''}
                    error={touched.endDate && !!errors.endDate}
                    name='endDate'
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{
                      className: 'input-field',
                      startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
                    }}
                  />
                </FormControl>
              </div>
            </MainCard>
            
            {/* Lapses Section */}
            <MainCard className={'form-data lapsos-container'}>
              <Box className="section-header">
                <Typography variant="h5" className="section-title">Lapsos</Typography>
              </Box>
              
              <FieldArray name='lapses'>
                {({ push, remove }) => (
                  <div className="lapses-list">
                    {values.lapses.map((lapse, i) => (
                      <Card key={i} className='lapse-card'>
                        <CardContent className='lapse-content'>
                          <Accordion defaultExpanded className="lapse-accordion">
                            <AccordionSummary
                              expandIcon={<ExpandMore />}
                              className="lapse-header"
                            >
                              <Typography variant='h6' className="lapse-title">Lapso #{i + 1}</Typography>
                              <Box className="lapse-actions">
                                <IconButton
                                  color='error'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    remove(i);
                                  }}
                                  size="small"
                                  className="delete-button"
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Box>
                            </AccordionSummary>
                            
                            <AccordionDetails className="lapse-details">
                              <div className='form-grid'>
                                <FormControl className='field-form' fullWidth>
                                  <TextField
                                    label='Fecha de Inicio'
                                    type='date'
                                    name={`lapses[${i}].startDate`}
                                    value={lapse.startDate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                      className: 'input-field',
                                      startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
                                    }}
                                  />
                                </FormControl>

                                <FormControl className='field-form' fullWidth>
                                  <TextField
                                    label='Fecha de Fin'
                                    type='date'
                                    name={`lapses[${i}].endDate`}
                                    value={lapse.endDate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                      className: 'input-field',
                                      startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
                                    }}
                                  />
                                </FormControl>
                              </div>

                              {/* Cortes section */}
                              <Box className="courts-container">
                                <Box className="courts-header">
                                  <Typography variant='subtitle1' className="courts-title">
                                    Cortes
                                  </Typography>
                                  <Button 
                                    variant="text" 
                                    startIcon={<Add />} 
                                    size="small"
                                    color="primary"
                                    onClick={() => push({ startDate: '', endDate: '' })}
                                    className="add-court-button"
                                  >
                                    Añadir
                                  </Button>
                                </Box>

                                <FieldArray name={`lapses[${i}].scholarCourts`}>
                                  {({ push, remove }) => (
                                    <div className="courts-list">
                                      {lapse.scholarCourts.map((court, j) => (
                                        <Paper key={j} elevation={1} className='court-card'>
                                          <Box className='court-header'>
                                            <Typography variant='subtitle2' className="court-title">
                                              Corte #{j + 1}
                                            </Typography>
                                            <IconButton
                                              color='error'
                                              onClick={() => remove(j)}
                                              size="small"
                                              className="delete-court-button"
                                            >
                                              <Delete fontSize="small" />
                                            </IconButton>
                                          </Box>
                                          
                                          <div className='court-form-grid'>
                                            <FormControl className='field-form' fullWidth>
                                              <TextField
                                                label='Fecha de Inicio'
                                                type='date'
                                                name={`lapses[${i}].scholarCourts[${j}].startDate`}
                                                value={court.startDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                InputLabelProps={{ shrink: true }}
                                                size="small"
                                                InputProps={{
                                                  className: 'input-field-small',
                                                  startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
                                                }}
                                              />
                                            </FormControl>

                                            <FormControl className='field-form' fullWidth>
                                              <TextField
                                                label='Fecha de Fin'
                                                type='date'
                                                name={`lapses[${i}].scholarCourts[${j}].endDate`}
                                                value={court.endDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                InputLabelProps={{ shrink: true }}
                                                size="small"
                                                InputProps={{
                                                  className: 'input-field-small',
                                                  startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
                                                }}
                                              />
                                            </FormControl>
                                          </div>
                                        </Paper>
                                      ))}
                                    </div>
                                  )}
                                </FieldArray>
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      variant='outlined'
                      color='primary'
                      type='button'
                      onClick={() =>
                        push({
                          startDate: '',
                          endDate: '',
                          scholarCourts: [{ startDate: '', endDate: '' }]
                        })
                      }
                      className="add-lapse-button"
                      startIcon={<Add />}
                    >
                      Añadir Lapso
                    </Button>
                  </div>
                )}
              </FieldArray>
            </MainCard>
            
            <MainCard className={'form-data flex-column'}>
              {errors.submit && (
                <FormHelperText error>{errors.submit}</FormHelperText>
              )}
              <Button
                variant='outlined'
                type='submit'
                color='primary'
                disabled={isSubmitting}
                className="guardar-button"
              >
                {isUpdate ? 'Actualizar' : 'Guardar'}
              </Button>
            </MainCard>
          </form>
        )}
      </Formik>
    </div>
  )
}

interface Props {
  isUpdate?: boolean
  className?: string
  onSubmit: OnSubmit
  title: string
  initialValues: FormValues
}

export interface ScholarCourt {
  startDate: string
  endDate: string
}

export interface Lapse {
  startDate: string
  endDate: string
  scholarCourts: ScholarCourt[]
}

export type FormValues = {
  code: string
  startDate: string
  lapses: Lapse[]
  endDate: string
  submit: string | null
}

export type OnSubmit = (
  values: FormValues,
  helpers: FormikHelpers<FormValues>
) => void | Promise<any>

export default styled(Form)`
  display: flex;
  flex-direction: column;

  .section-title {
    margin-bottom: 16px;
    font-weight: 500;
    font-size: 1.1rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 0;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .form-data {
    margin-top: 16px;
    padding: 16px;
    border-radius: 12px;
  }
  
  .input-field {
    border-radius: 8px;
  }
  
  .input-field-small {
    border-radius: 6px;
  }
  
  .calendar-icon {
    margin-right: 8px;
    color: #757575;
  }

  .field-form {
    margin: 12px 0px;
  }

  /* Lapses styling */
  .lapsos-container {
    padding: 16px;
  }
  
  .lapses-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .lapse-card {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    overflow: hidden;
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
    display: flex;
    padding: 12px 16px;
    min-height: 48px;
    background-color: #f5f5f5;
  }

  .lapse-title {
    flex-grow: 1;
    font-weight: 500;
    font-size: 1rem;
  }

  .lapse-actions {
    display: flex;
    align-items: center;
    margin-right: 8px;
  }

  .lapse-details {
    padding: 16px;
  }

  /* Courts styling */
  .courts-container {
    margin-top: 16px;
    padding: 0;
  }

  .courts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 0;
  }

  .courts-title {
    font-weight: 500;
    font-size: 1rem;
  }

  .courts-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .court-card {
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }

  .court-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    padding: A0;
  }

  .court-title {
    font-weight: 500;
    font-size: 0.9rem;
  }

  .court-form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .add-lapse-button, .add-court-button {
    margin-top: 12px;
    align-self: flex-start;
    padding: 6px 12px;
    font-size: 0.875rem;
  }
  
  .delete-button, .delete-court-button {
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
  }
  
  .guardar-button {
    margin-top: 0;
    align-self: flex-start;
    padding: 6px 16px;
    font-weight: 400;
  }
`
