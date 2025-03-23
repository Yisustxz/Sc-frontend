import { FunctionComponent } from 'react'
import * as Yup from 'yup'
import { Formik, FormikHelpers } from 'formik'
// material-ui
import MainCard from 'components/cards/MainCard'
import { Button, FormControl, FormHelperText, TextField } from '@mui/material'
import styled from 'styled-components'
import SelectField from 'components/SelectField'

const USE_AUTOCOMPLETES = false

const Form: FunctionComponent<Props> = ({
  className,
  title,
  onSubmit,
  initialValues,
  isUpdate
}) => {
  const isCreated = !isUpdate

  return (
    <div className={className}>
      <Formik
        validateOnChange={true}
        validateOnBlur={false}
        validateOnMount={false}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .max(30)
            .required('El nombre del usuario es requerido'),
          email: Yup.string()
            .max(30)
            .required('El correo electrónico del usuario es requerido'),
          role: Yup.string()
            .max(11)
            .required('El rol del usuario es requerido'),
          password: Yup.string()
            .max(30)
            .required('La contraseña del usuario es requerida'),
          confirmPassword: Yup.string()
            .max(30)
            .required('La confirmación de la contraseña del usuario es requerida')
            .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir'),
          submit: Yup.string().nullable()
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
                    id='name'
                    label='Nombre del usuario'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    helperText={touched.name ? errors.name : ''}
                    error={touched.name && !!errors.name}
                    name='name'
                  />
                </FormControl>
                <SelectField
                    fullWidth={true}
                    className="field-form"        
                    options={[
                      { label: 'profesor', value: 'nya',},
                      { label: 'empleado', value: 'nya'}
                      ]}
                    helperText={touched.role ? errors.role : ""}
                    label='Rol'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.role}
                    error={touched.role && !!errors.role}
                    name='role'
                  />
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
                    id='password'
                    label='Contraseña'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    helperText={touched.password ? errors.password : ''}
                    error={touched.password && !!errors.password}
                    name='password'
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='confirmPassword'
                    label='Confirme contraseña'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirmPassword}
                    helperText={touched.confirmPassword ? errors.confirmPassword : ''}
                    error={touched.confirmPassword && !!errors.confirmPassword}
                    name='confirmPassword'
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
  id: string
  name: string
  email: string
  role: string
  password: string,
  confirmPassword: string,
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
