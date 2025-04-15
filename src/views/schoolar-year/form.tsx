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
  IconButton
} from '@mui/material'
import { Delete } from '@mui/icons-material'
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
                  />
                </FormControl>
              </div>
            </MainCard>
            {/* Lapses */}
            <MainCard className={'form-data'} title='Lapsos'>
              <FieldArray name='lapses'>
                {({ push, remove }) => (
                  <>
                    {values.lapses.map((lapse, i) => (
                      <div key={i} className='lapse-section'>
                        <div className='lapse-header'>
                          <Typography variant='h6'>Lapso #{i + 1}</Typography>
                          <IconButton
                            color='error'
                            onClick={() => remove(i)}
                            aria-label='Eliminar lapso'
                          >
                            <Delete />
                          </IconButton>
                        </div>

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
                            />
                          </FormControl>
                        </div>

                        <Typography variant='subtitle1'>
                          Cortes del Lapso
                        </Typography>

                        <FieldArray name={`lapses[${i}].scholarCourts`}>
                          {({ push, remove }) => (
                            <>
                              <div className='form-grid'>
                                {lapse.scholarCourts.map((court, j) => (
                                  <div key={j} className='court-section'>
                                    <div className='court-header'>
                                      <Typography variant='h4'>
                                        Corte #{j + 1}
                                      </Typography>
                                      <IconButton
                                        color='error'
                                        onClick={() => remove(j)}
                                        aria-label='Eliminar corte'
                                        size='small'
                                      >
                                        <Delete fontSize='small' />
                                      </IconButton>
                                    </div>

                                    <FormControl
                                      className='field-form'
                                      fullWidth
                                    >
                                      <TextField
                                        label='Fecha de Inicio'
                                        type='date'
                                        name={`lapses[${i}].scholarCourts[${j}].startDate`}
                                        value={court.startDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        InputLabelProps={{ shrink: true }}
                                      />
                                    </FormControl>

                                    <FormControl
                                      className='field-form'
                                      fullWidth
                                    >
                                      <TextField
                                        label='Fecha de Fin'
                                        type='date'
                                        name={`lapses[${i}].scholarCourts[${j}].endDate`}
                                        value={court.endDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        InputLabelProps={{ shrink: true }}
                                      />
                                    </FormControl>
                                  </div>
                                ))}
                              </div>

                              <Button
                                variant='outlined'
                                color='primary'
                                type='button'
                                onClick={() =>
                                  push({ startDate: '', endDate: '' })
                                }
                                sx={{ mb: 2 }}
                              >
                                Añadir Corte
                              </Button>
                            </>
                          )}
                        </FieldArray>
                      </div>
                    ))}

                    <Button
                      variant='outlined'
                      color='secondary'
                      type='button'
                      onClick={() =>
                        push({
                          startDate: '',
                          endDate: '',
                          scholarCourts: [{ startDate: '', endDate: '' }]
                        })
                      }
                    >
                      Añadir Lapso
                    </Button>
                  </>
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

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .form-data {
    margin-top: 16px;
  }

  .field-form {
    margin: 12px 0px;
  }

  .lapse-section {
    margin-bottom: 32px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 16px;
  }

  .lapse-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .court-section {
    margin-bottom: 16px;
  }

  .court-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`
