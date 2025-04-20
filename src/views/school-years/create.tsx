import { FunctionComponent, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import BreadcrumbsNav from 'components/BreadcrumbsNav'
import Form from './form/index'
import { FormValues } from './form/types'
import styled from 'styled-components'
import createSchoolYear from 'services/school-year/create-school-year'
import { mapFormValuesToPayload } from './utils/mappers'
import { FormikHelpers } from 'formik'
import { useAppDispatch } from 'store'
import { setErrorMessage, setIsLoading, setSuccessMessage } from 'store/customizationSlice'
import BackendError from 'exceptions/backend-error'

interface Props {
  className?: string
}

const breadcrumbsItems = [
  {
    label: 'Años Escolares',
    path: '/school-years'
  },
  {
    label: 'Crear Año Escolar',
    active: true
  }
]

const initialValues: FormValues = {
  code: '',
  startDate: '',
  endDate: '',
  lapses: [],
  submit: null
}

const CreateSchoolYear: FunctionComponent<Props> = ({ className }) => {
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
        const payload = mapFormValuesToPayload(values)
        await createSchoolYear(payload)
        navigate('/school-years')
        dispatch(
          setSuccessMessage(
            `Año escolar ${values.code} creado correctamente`
          )
        )
      } catch (error) {
        if (error instanceof BackendError) {
          setErrors({
            ...error.getFieldErrorsMessages(),
            submit: error.getMessage()
          })
          dispatch(setErrorMessage(error.getMessage()))
        } else {
          setErrors({
            submit: 'Error al crear el año escolar'
          })
          dispatch(setErrorMessage('Error al crear el año escolar'))
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
      <BreadcrumbsNav items={breadcrumbsItems} />
      <Form
        initialValues={initialValues}
        title="Crear Año Escolar"
        onSubmit={onSubmit}
        isUpdate={false}
      />
    </div>
  )
}

export default styled(CreateSchoolYear)`
  width: 100%;
`
