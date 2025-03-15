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
        userDni: Yup.string()
          .max(8)
          .required('La cedula del usuario es requerida')
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
            .required('El nombre del usuario es requerido'),
          email: Yup.string()
            .max(30)
            .required('El correo electrónico del usuario es requerido'),
          role: Yup.string()
            .max(11)
            .required('El rol del usuario es requerido')
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
                      id='userDni'
                      label='Cédula'
                      variant='outlined'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.userDni}
                      helperText={touched.userDni ? errors.userDni : ''}
                      error={touched.userDni && !!errors.userDni}
                      name='userDni'
                    />
                  </FormControl>
                )}
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='name'
                    label='Nombre del cliente'
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
                    id='role'
                    label='Rol'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.role}
                    helperText={touched.role ? errors.role : ''}
                    error={touched.role && !!errors.role}
                    name='mainPhone'
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
  userDni: string
  name: string
  email: string
  role: string
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
