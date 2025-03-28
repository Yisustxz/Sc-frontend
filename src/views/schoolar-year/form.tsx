import { FunctionComponent } from 'react'
import * as Yup from 'yup'
import { Formik, FormikHelpers } from 'formik'
// material-ui
import MainCard from 'components/cards/MainCard'
import { Button, FormControl, FormHelperText, TextField } from '@mui/material'
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

export type FormValues = {
  id: number
  code: string
  startDate: string
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
`
