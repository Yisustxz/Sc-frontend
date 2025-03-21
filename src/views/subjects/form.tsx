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

  const extraValidations: any = isCreated
    ? {
        subjectId: Yup.string()
          .max(8)
          .required('El id de la asignatura es requerido')
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
            .required('El nombre de la asignatura es requerido'),
          grade: Yup.string()
            .max(30)
            .required('El grado de la asignatura es requerido'),
          teacher: Yup.string()
            .max(11)
            .required('El profesor de la asignatura es requerido'),
          weeklyHours: Yup.number()
            .max(11)
            .required('Las horas semanales de la asignatura son requeridas'),
          subjectType: Yup.string()
            .max(11)
            .required('El tipo de asignatura es requerido')
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
                    options={[
                      { label: '1er grado', value: 'nya' },]}
                    helperText={touched.grade ? errors.grade : ""}
                    id='grade'
                    label='Grado'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={touched.grade && !!errors.grade}
                    name='grade'
                    value={values.grade}
                  />
                  <SelectField
                    fullWidth={true}
                    className="field-form"        
                    options={[
                      { label: 'guayaba', value: 'nya' },]}
                    helperText={touched.teacher ? errors.teacher : ""}
                    id='teacher'
                    label='Profesor'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.teacher}
                    error={touched.teacher && !!errors.teacher}
                    name='teacher'
                  />
                   <SelectField
                    fullWidth={true}
                    className="field-form"        
                    options={[
                      { label: 'cualitativa', value: 'nya'},
                      { label: 'cuantitativa', value: 'nya'}
                      ]}
                    helperText={touched.subjectType ? errors.subjectType : ""}
                    id='subjectType'
                    label='Tipo de asignatura'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    variant='outlined'
                    value={values.subjectType}
                    error={touched.subjectType && !!errors.subjectType}
                    name='subjectType'
                  />
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='weeklyHours'
                    label='Horas semanales'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.weeklyHours}
                    helperText={touched.weeklyHours ? errors.weeklyHours : ''}
                    error={touched.weeklyHours && !!errors.weeklyHours}
                    name='weeklyHours'
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
  grade: string
  teacher: string
  weeklyHours: number | null
  subjectType: string
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
