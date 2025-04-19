import { FunctionComponent, useCallback } from 'react'
// material-ui
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
import createSchoolYear from 'services/school-year/create-school-year'
import BreadcrumbsNav from 'components/BreadcrumbsNav'
import { SchoolLapse } from 'core/school-year/types'

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
        
        // Transformar las lapses del formulario en schoolLapses con la estructura correcta
        const schoolLapses: SchoolLapse[] = values.lapses.map(lapse => ({
          startDate: lapse.startDate,
          endDate: lapse.endDate,
          schoolCourts: lapse.scholarCourts.map(court => ({
            startDate: court.startDate,
            endDate: court.endDate
          }))
        }))
        
        const payload = {
          schoolYear: {
            code: values.code,
            startDate: values.startDate,
            endDate: values.endDate
          },
          schoolLapses
        }
        
        await createSchoolYear(payload)
        navigate('/school-years')
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

  const breadcrumbsItems = [
    {
      label: 'Años Escolares',
      path: '/school-years'
    },
    {
      label: 'Crear Año Escolar'
    }
  ];

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />

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

export default styled(CreateSchoolYear)`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
`
