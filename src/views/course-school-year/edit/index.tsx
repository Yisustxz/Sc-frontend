import { FunctionComponent, useCallback } from 'react'
// material-ui
import styled from 'styled-components'
import { useNavigate } from 'react-router'
//own
import BackendError from 'exceptions/backend-error'
import { useAppDispatch } from '../../../store/index'
import {
  setIsLoading,
  setSuccessMessage,
  setErrorMessage
} from 'store/customizationSlice'
import Form, { FormValues } from '../form'
import updateCourseSchoolYear from 'services/course-school-year/update-course-school-year'
import useCourseSchoolYearById from './use-course-school-year-by-id'
import useCourseSchoolYearId from './use-course-school-year-id'
import { FormikHelpers } from 'formik'
import BreadcrumbsNav from 'components/BreadcrumbsNav'

const EditCourseSchoolYear: FunctionComponent<Props> = ({ className }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const courseSchoolYearId = useCourseSchoolYearId()
  const courseSchoolYear = useCourseSchoolYearById(courseSchoolYearId)

  const onSubmit = useCallback(
    async (
      values: FormValues,
      { setErrors, setStatus, setSubmitting }: FormikHelpers<FormValues>
    ) => {
      try {
        if (!courseSchoolYearId) return;
        
        dispatch(setIsLoading(true))
        setErrors({})
        setStatus({})
        setSubmitting(true)
        
        // Preparar payload para actualización
        const payload = {
          grade: values.grade,
          weeklyHours: values.weeklyHours || null,
          professorId: values.professorId || null,
        };
        
        await updateCourseSchoolYear(courseSchoolYearId, payload)
        navigate('/course-school-year')
        dispatch(
          setSuccessMessage('Asignatura por año escolar actualizada correctamente')
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
    [courseSchoolYearId, navigate, dispatch]
  )

  const breadcrumbsItems = [
    {
      label: 'Asignaturas por Año Escolar',
      path: '/course-school-year'
    },
    {
      label: 'Editar Asignatura por Año Escolar'
    }
  ];

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />
      
      {courseSchoolYear && (
        <Form
          isUpdate={true}
          initialValues={{
            grade: courseSchoolYear.grade,
            courseId: courseSchoolYear.courseId,
            schoolYearId: courseSchoolYear.schoolYearId,
            weeklyHours: courseSchoolYear.weeklyHours || null,
            professorId: courseSchoolYear.professorId || null,
            submit: null
          }}
          title={'Editar Asignatura por Año Escolar'}
          onSubmit={onSubmit}
        />
      )}
    </div>
  )
}

interface Props {
  className?: string
}

export default styled(EditCourseSchoolYear)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
` 