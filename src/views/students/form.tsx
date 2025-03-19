import { FunctionComponent } from 'react'
import * as Yup from 'yup'
import { Formik, FormikHelpers } from 'formik'
// material-ui
import MainCard from 'components/cards/MainCard'
import {
  Button,
  FormControl,
  FormHelperText,
  TextField,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material'
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
        ci: Yup.string()
          .max(8, 'La cédula del Alumno no puede tener más de 8 numeros')
          .required('La cedula del alumno es requerida')
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
          nombre: Yup.string()
            .max(30, 'El nombre del Alumno no puede tener más de 30 caracteres')
            .required('El nombre del Alumno es requerido'),
          apellido: Yup.string()
            .max(
              30,
              'El apellido del Alumno no puede tener más de 30 caracteres'
            )
            .required('El apellido del Alumno es requerido'),
          telefono: Yup.string()
            .max(
              11,
              'El teléfono del Empleado no puede tener más de 11 caracteres'
            )
            .required('El teléfono del Empleado es requerido'),
          direccion: Yup.string().required(
            'La dirección del Empleado es requerido'
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
                {isCreated && (
                  <FormControl className='field-form' fullWidth>
                    <TextField
                      id='ci'
                      label='Cédula'
                      variant='outlined'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.ci}
                      helperText={touched.ci ? errors.ci : ''}
                      error={touched.ci && !!errors.ci}
                      name='ci'
                    />
                  </FormControl>
                )}
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='nombre'
                    label='Nombre'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.nombre}
                    helperText={touched.nombre ? errors.nombre : ''}
                    error={touched.nombre && !!errors.nombre}
                    name='nombre'
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='apellido'
                    label='Apellido'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.apellido}
                    helperText={touched.apellido ? errors.apellido : ''}
                    error={touched.apellido && !!errors.apellido}
                    name='apellido'
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='telefono'
                    label='Teléfono'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.telefono}
                    helperText={touched.telefono ? errors.telefono : ''}
                    error={touched.telefono && !!errors.telefono}
                    name='telefono'
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='direccion'
                    label='Dirección'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.direccion}
                    helperText={touched.direccion ? errors.direccion : ''}
                    error={touched.direccion && !!errors.direccion}
                    name='direccion'
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='fechaNacimiento'
                    label='Fecha de Nacimiento'
                    variant='outlined'
                    type='date'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.fechaNacimiento}
                    helperText={
                      touched.fechaNacimiento ? errors.fechaNacimiento : ''
                    }
                    error={touched.fechaNacimiento && !!errors.fechaNacimiento}
                    name='fechaNacimiento'
                    InputLabelProps={{
                      shrink: true
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
  ci: string
  nombre: string
  apellido: string
  telefono: string
  direccion: string
  fechaNacimiento: string
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
