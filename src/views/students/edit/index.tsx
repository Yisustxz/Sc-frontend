import { FunctionComponent, useCallback } from 'react'
// material-ui
import MainCard from 'components/cards/MainCard'
import { Typography } from '@mui/material'
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
            `Alumno ${values.nombre} ${values.apellido} editado correctamente`
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

  return (
    <div className={className}>
      <MainCard>
        <Typography variant='h3' component='h3'>
          Clientes
        </Typography>
      </MainCard>
      {student && (
        <Form
          isUpdate={true}
          initialValues={{
            ci: student.ci,
            nombre: student.nombre,
            apellido: student.apellido,
            telefono: student.telefono,
            direccion: student.direccion,
            fechaNacimiento: student.fechaNacimiento,
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

  .flex-column {
    display: flex;
    flex-direction: column;
  }

  .form-data {
    margin-top: 16px;
  }

  .form-header-card {
    width: 100%;
  }

  .form-header {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
`
