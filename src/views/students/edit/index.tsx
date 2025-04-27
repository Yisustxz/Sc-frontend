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
import editStudent from 'services/students/edit-student'
import useStudentById from './use-student-by-id'
import useStudentId from './use-student-id'
import { FormikHelpers } from 'formik'
import BreadcrumbsNav from 'components/BreadcrumbsNav'

const EditStudent: FunctionComponent<Props> = ({ className }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const studentId = useStudentId()
  const student = useStudentById(studentId)

  const onSubmit = useCallback(
    async (
      values: any,
      { setErrors, setStatus, setSubmitting }: FormikHelpers<FormValues>
    ) => {
      try {
        dispatch(setIsLoading(true))
        setErrors({})
        setStatus({})
        setSubmitting(true)
        await editStudent(studentId!, values)
        navigate('/students')
        dispatch(
          setSuccessMessage(
            `Alumno ${values.name} ${values.lastName} editado correctamente`
          )
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
    [studentId, navigate, dispatch]
  )

  const breadcrumbsItems = [
    {
      label: 'Alumnos',
      path: '/students'
    },
    {
      label: 'Editar Alumno'
    }
  ];

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />
      
      {student && (
        <Form
          isUpdate={true}
          initialValues={{
            dni: student.dni,
            name: student.name,
            lastName: student.lastName,
            phone: student.phone,
            direction: student.direction,
            birthDate: student.birthDate,
            representativeId: student.representativeId || student.representative?.id || null,
            submit: null
          }}
          title={'Editar Alumno'}
          onSubmit={onSubmit}
        />
      )}
    </div>
  )
}

interface Props {
  className?: string
}

export default styled(EditStudent)`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
`
