import { FunctionComponent } from 'react'
import * as Yup from 'yup'
import { Formik, FormikHelpers } from 'formik'
// material-ui
import MainCard from 'components/cards/MainCard'
import { Button, FormControl, FormHelperText, TextField } from '@mui/material'
import styled from 'styled-components'

const USE_AUTOCOMPLETES = false

const Form: FunctionComponent<Props> = ({
  className,
  title,
  onSubmit,
  initialValues,
  isUpdate
}) => {
  const isCreated = !isUpdate

  const extraValidations: any = isCreated
    ? {
        dni: Yup.string()
          .max(8)
          .required('La cedula del Representante es requerida')
      }
    : {}

  return (
    <div className={className}>
      <Formik
        validateOnChange={true}
        validateOnBlur={false}
        validateOnMount={false}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          ...extraValidations,
          name: Yup.string()
            .max(30)
            .required('El nombre del Representante es requerido'),
          lastName: Yup.string()
            .max(30)
            .required('El apellido del Representante es requerido'),
          phone: Yup.string()
            .max(30)
            .required('El teléfono del Representante es requerido'),
          direction: Yup.string()
            .max(11)
            .required('La direccion del Representante es requerido')
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
                {isCreated && (
                  <FormControl className='field-form' fullWidth>
                    <TextField
                      id='dni'
                      label='Cédula'
                      variant='outlined'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.dni}
                      helperText={touched.dni ? errors.dni : ''}
                      error={touched.dni && !!errors.dni}
                      name='dni'
                      inputProps={{ maxLength: 8 }}
                    />
                  </FormControl>
                )}
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='name'
                    label='Nombre del Representante'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    helperText={touched.name ? errors.name : ''}
                    error={touched.name && !!errors.name}
                    name='name'
                    inputProps={{ maxLength: 30 }}
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='lastName'
                    label='Apellido del Representante'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    helperText={touched.lastName ? errors.lastName : ''}
                    error={touched.lastName && !!errors.lastName}
                    name='lastName'
                    inputProps={{ maxLength: 30 }}
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='phone'
                    label='Numero de Telefono'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                    helperText={touched.phone ? errors.phone : ''}
                    error={touched.phone && !!errors.phone}
                    name='phone'
                    inputProps={{ maxLength: 11 }}
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='direction'
                    label='direccion de casa'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.direction}
                    helperText={touched.direction ? errors.direction : ''}
                    error={touched.direction && !!errors.direction}
                    name='direction'
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='birthDate'
                    label='Fecha de Nacimiento'
                    variant='outlined'
                    type='date'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.birthDate}
                    helperText={touched.birthDate ? errors.birthDate : ''}
                    error={touched.birthDate && !!errors.birthDate}
                    name='birthDate'
                    InputLabelProps={{
                      shrink: true
                    }}
                    inputProps={{
                      max: new Date().toISOString().split('T')[0]
                    }}
                  />
                </FormControl>
              </div>
            </MainCard>

            <MainCard className={'form-data flex-column'}>
              {errors.submit && (
                <FormHelperText error>{errors.submit}</FormHelperText>
              )}
              <Button variant='outlined' type='submit' color='primary'>
                Guardar
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

export type FormValues = {
  dni: string
  name: string
  lastName: string
  phone: string
  direction: string
  birthDate: string
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
    gap: 16px; /* Espacio entre columnas */
  }

  .form-data {
    margin-top: 16px;
  }

  .field-form {
    margin: 12px 0px;
  }
`
