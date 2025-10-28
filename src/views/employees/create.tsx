import { FunctionComponent, useCallback } from 'react'
// material-ui
import styled from 'styled-components'
import BackendError from 'exceptions/backend-error'
import createEmployee from 'services/employees/create-employee'
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
import { TypeEmployee } from 'core/employees/types'

const CreateEmployee: FunctionComponent<Props> = ({ className }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const onSubmit = useCallback(
    async (
      values: any,
      { setErrors, setStatus, setSubmitting }: FormikHelpers<FormValues>
    ) => {

      console.log('submit attemp create', values);

      try {
        dispatch(setIsLoading(true))
        setErrors({})
        setStatus({})
        setSubmitting(true)
        await createEmployee(values)
        navigate('/employees')
        dispatch(
          setSuccessMessage(
            `Empleado ${values.name} ${values.lastName} creado correctamente`
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
    [dispatch, navigate]
  )

  const breadcrumbsItems = [
    {
      label: 'Empleados',
      path: '/employees'
    },
    {
      label: 'Crear Empleado'
    }
  ];

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />

      <Form
        initialValues={{
          dni: '',
          name: '',
          lastName: '',
          phone: '',
          direction: '',
          birthDate: '',
          employeeType: TypeEmployee.Professor,
          userId: null,
          submit: null
        }}
        title={'Crear Empleado'}
        onSubmit={onSubmit}
      />
    </div>
  )
}

interface Props {
  className?: string
}

export default styled(CreateEmployee)`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
`
