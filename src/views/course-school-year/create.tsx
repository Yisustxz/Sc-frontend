import { FunctionComponent, useCallback } from 'react'
// material-ui
import styled from 'styled-components'
import BackendError from 'exceptions/backend-error'
import createCourseSchoolYear from 'services/course-school-year/create-course-school-year'
import { useNavigate } from 'react-router'
import {
  setErrorMessage,
  setIsLoading,
  setSuccessMessage
} from 'store/customizationSlice'
import { useAppDispatch } from '../../store/index'
import Form, { FormValues } from './form'
import { FormikHelpers } from 'formik'
import BreadcrumbsNav from 'components/BreadcrumbsNav'

const CreateCourseSchoolYear: FunctionComponent<Props> = ({ className }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const onSubmit = useCallback(
    async (
      values: FormValues,
      { setErrors, setStatus, setSubmitting }: FormikHelpers<FormValues>
    ) => {
      try {
        dispatch(setIsLoading(true))
        setErrors({})
        setStatus({})
        setSubmitting(true)
        
        // Preparar el payload
        const payload = {
          grade: values.grade,
          courseId: values.courseId!,
          schoolYearId: values.schoolYearId!,
          weeklyHours: values.weeklyHours || null,
          professorId: values.professorId || null
        };
        
        await createCourseSchoolYear(payload)
        navigate('/course-school-year')
        dispatch(
          setSuccessMessage(`Asignatura por año escolar creada correctamente`)
        )
      } catch (error) {
        if (error instanceof BackendError) {
          setErrors({
            ...error.getFieldErrorsMessages(),
            submit: error.getMessage()
          })
          dispatch(setErrorMessage(error.getMessage()))
        }
        setStatus({ success: 'false' })
      } finally {
        dispatch(setIsLoading(false))
        setSubmitting(false)
      }
    },
    [dispatch, navigate]
  )

  const breadcrumbsItems = [
    {
      label: 'Asignaturas por Año Escolar',
      path: '/course-school-year'
    },
    {
      label: 'Crear Asignatura por Año Escolar'
    }
  ];

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />

      <Form
        initialValues={{
          grade: 1,
          courseId: undefined,
          schoolYearId: undefined,
          weeklyHours: null,
          professorId: null,
          submit: null
        }}
        title={'Crear Asignatura por Año Escolar'}
        onSubmit={onSubmit}
      />
    </div>
  )
}

interface Props {
  className?: string
}

export default styled(CreateCourseSchoolYear)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
` 