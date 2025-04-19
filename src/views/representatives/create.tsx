import { FunctionComponent, useCallback } from 'react'
// material-ui
import styled from 'styled-components'
import BackendError from 'exceptions/backend-error'
import createRepresentative from 'services/representatives/create-representatives'
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

const CreateRepresentative: FunctionComponent<Props> = ({ className }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

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
        await createRepresentative(values)
        navigate('/representatives')
        dispatch(
          setSuccessMessage(
            `representante ${values.name} ${values.lastName} creado correctamente`
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
      label: 'Representantes',
      path: '/representatives'
    },
    {
      label: 'Crear Representante'
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
          submit: null
        }}
        title={'Crear representante'}
        onSubmit={onSubmit}
      />
    </div>
  )
}

interface Props {
  className?: string
}

export default styled(CreateRepresentative)`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
`
