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
        clientDni: Yup.string()
          .max(8)
          .required('La cedula del cliente es requerida')
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
            .required('El nombre del cliente es requerido'),
          email: Yup.string()
            .max(30)
            .required('El correo electrónico del cliente es requerido'),
          mainPhone: Yup.string()
            .max(11)
            .required('El teléfono principal del cliente es requerido'),
          secondaryPhone: Yup.string()
            .max(11)
            .required('El teléfono secundario del cliente es requerido')
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
                      id='clientDni'
                      label='Cédula'
                      variant='outlined'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.clientDni}
                      helperText={touched.clientDni ? errors.clientDni : ''}
                      error={touched.clientDni && !!errors.clientDni}
                      name='clientDni'
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
                    id='mainPhone'
                    label='Teléfono principal'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.mainPhone}
                    helperText={touched.mainPhone ? errors.mainPhone : ''}
                    error={touched.mainPhone && !!errors.mainPhone}
                    name='mainPhone'
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='secondaryPhone'
                    label='Teléfono secundario'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.secondaryPhone}
                    helperText={
                      touched.secondaryPhone ? errors.secondaryPhone : ''
                    }
                    error={touched.secondaryPhone && !!errors.secondaryPhone}
                    name='secondaryPhone'
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
  clientDni: string
  name: string
  email: string
  mainPhone: string
  secondaryPhone: string
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
