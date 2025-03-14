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
import { ro } from 'date-fns/locale'
import { Margin } from '@mui/icons-material'

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
        employeeDni: Yup.string()
          .max(8, 'La cédula del Empleado no puede tener más de 8 numeros')
          .required('La cedula del Empleado es requerida')
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
            .max(
              30,
              'El nombre del Empleado no puede tener más de 30 caracteres'
            )
            .required('El nombre del Empleado es requerido'),
          lastName: Yup.string()
            .max(
              30,
              'El apellido del Empleado no puede tener más de 30 caracteres'
            )
            .required('El apellido del Empleado es requerido'),
          email: Yup.string()
            .max(
              30,
              'El correo electrónico del Empleado no puede tener más de 30 caracteres'
            )
            .required('El correo electrónico del Empleado es requerido'),
          phone: Yup.string()
            .max(
              11,
              'El teléfono del Empleado no puede tener más de 11 caracteres'
            )
            .required('El teléfono del Empleado es requerido'),
          address: Yup.string().required(
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
                      id='employeeDni'
                      label='Cédula'
                      variant='outlined'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.employeeDni}
                      helperText={touched.employeeDni ? errors.employeeDni : ''}
                      error={touched.employeeDni && !!errors.employeeDni}
                      name='employeeDni'
                    />
                  </FormControl>
                )}
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='name'
                    label='Nombre'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    helperText={touched.name ? errors.name : ''}
                    error={touched.name && !!errors.name}
                    name='name'
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='lastName'
                    label='Apellido'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    helperText={touched.lastName ? errors.lastName : ''}
                    error={touched.lastName && !!errors.lastName}
                    name='lastName'
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='email'
                    label='Correo electrónico'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    helperText={touched.email ? errors.email : ''}
                    error={touched.email && !!errors.email}
                    name='email'
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='phone'
                    label='Teléfono'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                    helperText={touched.phone ? errors.phone : ''}
                    error={touched.phone && !!errors.phone}
                    name='phone'
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='address'
                    label='Dirección'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.address}
                    helperText={touched.address ? errors.address : ''}
                    error={touched.address && !!errors.address}
                    name='address'
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <InputLabel id='role-label'>Seleccionar Rol</InputLabel>
                  <Select
                    id='role'
                    name='role'
                    value={values.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.role && !!errors.role}
                  >
                    {Object.values(EmployeeRole).map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.role && errors.role && (
                    <FormHelperText error>{errors.role}</FormHelperText>
                  )}
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

export enum EmployeeRole {
  administrative = 'Administrativo',
  professor = 'Profesor',
  director = 'Director',
  coordinator = 'Coordinador'
}

export type FormValues = {
  employeeDni: string
  name: string
  lastName: string
  email: string
  phone: string
  address: string
  role: EmployeeRole | string
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
