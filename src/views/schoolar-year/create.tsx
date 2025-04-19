import { FunctionComponent, useCallback } from 'react'
// material-ui
import MainCard from 'components/cards/MainCard'
import { Typography, Box, Paper, Breadcrumbs, Link } from '@mui/material'
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
import { IconHome, IconChevronRight } from '@tabler/icons'

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
      <Paper className="breadcrumbs-container">
        <Breadcrumbs aria-label="breadcrumb" separator={<IconChevronRight size={16} />}>
          <Link
            color="inherit"
            href="/"
            className="breadcrumb-link"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
          >
            <IconHome size={16} />
            <span>Inicio</span>
          </Link>
          <Link
            color="inherit"
            href="/schoolar-year"
            className="breadcrumb-link"
            onClick={(e) => {
              e.preventDefault();
              navigate('/schoolar-year');
            }}
          >
            Años Escolares
          </Link>
          <Typography color="text.primary">Crear Año Escolar</Typography>
        </Breadcrumbs>
      </Paper>

      <MainCard className="main-container">
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
      </MainCard>
    </div>
  )
}

interface Props {
  className?: string
}

export default styled(CreateSchoolarYear)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 12px 0;

  .breadcrumbs-container {
    padding: 16px 24px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .breadcrumb-link {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    padding: 4px 0;
    
    &:hover {
      text-decoration: underline;
    }
  }

  .main-container {
    padding: 0;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
`
