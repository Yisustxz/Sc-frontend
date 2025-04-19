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
import editEmployee from 'services/employees/edit-employee'
import useEmployeeById from './use-employee-by-id'
import useEmployeeId from './use-employee-id'
import { FormikHelpers } from 'formik'
import BreadcrumbsNav from 'components/BreadcrumbsNav'

const EditEmployee: FunctionComponent<Props> = ({ className }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const employeeId = useEmployeeId()
  const employee = useEmployeeById(employeeId)

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
        await editEmployee(employeeId!, values)
        navigate('/employees')
        dispatch(
          setSuccessMessage(
            `Empleado ${values.name} ${values.lastName} editado correctamente`
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
    [employeeId, navigate, dispatch]
  )

  const breadcrumbsItems = [
    {
      label: 'Empleados',
      path: '/employees'
    },
    {
      label: 'Editar Empleado'
    }
  ];

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />
      
      {employee && (
        <Form
          isUpdate={true}
          initialValues={{
            dni: employee.dni,
            name: employee.name,
            lastName: employee.lastName,
            phone: employee.phone,
            direction: employee.direction,
            birthDate: employee.birthDate,
            employeeType: employee.employeeType,
            submit: null
          }}
          title={'Editar Empleado'}
          onSubmit={onSubmit}
        />
      )}
    </div>
  )
}

interface Props {
  className?: string
}

export default styled(EditEmployee)`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
`
