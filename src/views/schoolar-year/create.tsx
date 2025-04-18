import { FunctionComponent, useCallback } from 'react'
// material-ui
import MainCard from 'components/cards/MainCard'
import { Typography } from '@mui/material'
import styled from 'styled-components'
import BackendError from 'exceptions/backend-error'
import { useNavigate } from 'react-router'
import {
  setErrorMessage,
  setIsLoading,
  setSuccessMessage
} from 'store/customizationSlice'
import { useAppDispatch } from 'store/index'
import Form, { FormValues } from './form'
import { FormikHelpers } from 'formik'
import createSchoolarYear from 'services/schoolar-year/create-schoolar-year'

const CreateSchoolarYear: FunctionComponent<Props> = ({ className }) => {
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
        const payload = {
          schoolarYear: {
            code: values.code,
            startDate: values.startDate,
            endDate: values.endDate
          },
          lapses: values.lapses
        }
        await createSchoolarYear(payload)
        navigate('/schoolar-year')
        dispatch(
          setSuccessMessage(`Año Escolar ${values.code} creado correctamente`)
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

  return (
    <div className={className}>
      <MainCard>
        <Typography variant='h3' component='h3'>
          Años Escolares
        </Typography>
      </MainCard>

      <Form
        initialValues={{
          code: '',
          startDate: '',
          endDate: '',
          lapses: [
            {
              startDate: '',
              endDate: '',
              scholarCourts: [
                {
                  startDate: '',
                  endDate: ''
                }
              ]
            }
          ],
          submit: null
        }}
        title={'Crear Año Escolar'}
        onSubmit={onSubmit}
      />
    </div>
  )
}

interface Props {
  className?: string
}

export default styled(CreateSchoolarYear)`
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
