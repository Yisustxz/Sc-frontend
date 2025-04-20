import { FunctionComponent } from 'react'
import * as Yup from 'yup'
import { Formik, FormikHelpers } from 'formik'
// material-ui
import MainCard from 'components/cards/MainCard'
import { Button, FormControl, FormHelperText, TextField } from '@mui/material'
import styled from 'styled-components'
import SelectField from 'components/SelectField'
import { getLevelsAsOptions } from 'core/courses/use-education-levels'

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
    ? {}
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
            .required('El nombre de la asignatura es requerido'),
          grade: Yup.number()
            .typeError('El grado debe ser un número')
            .required('El grado de la asignatura es requerido')
            .nullable(false)
            .min(1, 'El grado debe ser un número positivo'),
          publicName: Yup.string()
            .max(50)
            .nullable()
            .optional()
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
          values,
          setFieldValue
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <MainCard className={'form-data'} title={title}>
              <div className='form-grid'>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='name'
                    label='Nombre de la asignatura'
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
                    options={getLevelsAsOptions()}
                    helperText={touched.grade ? errors.grade : ""}
                    label='Grado por defecto'
                    onBlur={handleBlur}
                    onChange={(e) => {
                      // Convertir a número el valor seleccionado
                      const numValue = Number(e.target.value);
                      setFieldValue('grade', numValue);
                    }}
                    error={touched.grade && !!errors.grade}
                    name='grade'
                    value={values.grade}
                  />
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='publicName'
                    label='Nombre de boletín'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.publicName || ''}
                    helperText={touched.publicName ? errors.publicName : ''}
                    error={touched.publicName && !!errors.publicName}
                    name='publicName'
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
  name: string
  grade: number
  publicName?: string
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
