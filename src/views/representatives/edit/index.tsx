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
import editRepresentative from 'services/representatives/edit-representatives'
import useRepresentativeById from './use-representative-by-id'
import useRepresentativeId from './use-representative-id'
import { FormikHelpers } from 'formik'

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

  return (
    <div className={className}>
      <MainCard>
        <Typography variant='h3' component='h3'>
          Clientes
        </Typography>
      </MainCard>
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
