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
import editRepresentative from 'services/representatives/edit-representatives'
import useRepresentativeById from './use-representative-by-id'
import useRepresentativeId from './use-representative-id'
import { FormikHelpers } from 'formik'
import BreadcrumbsNav from 'components/BreadcrumbsNav'

const EditRepresentative: FunctionComponent<Props> = ({ className }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const representativeId = useRepresentativeId()
  const representative = useRepresentativeById(representativeId)

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
        await editRepresentative(representativeId!, values)
        navigate('/representatives')
        dispatch(
          setSuccessMessage(
            `Representante ${values.name} ${values.lastName} editado correctamente`
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
    [representativeId, navigate, dispatch]
  )

  const breadcrumbsItems = [
    {
      label: 'Representantes',
      path: '/representatives'
    },
    {
      label: 'Editar Representante'
    }
  ];

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />
      
      {representative && (
        <Form
          isUpdate={true}
          initialValues={{
            dni: representative.dni,
            name: representative.name,
            lastName: representative.lastName,
            phone: representative.phone,
            direction: representative.direction,
            birthDate: representative.birthDate,
            submit: null
          }}
          title={'Editar Representante'}
          onSubmit={onSubmit}
        />
      )}
    </div>
  )
}

interface Props {
  className?: string
}

export default styled(EditRepresentative)`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
`
