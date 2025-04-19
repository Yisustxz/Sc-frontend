import { FunctionComponent, useCallback, useEffect } from 'react'
// material-ui
import styled from 'styled-components'
import { useNavigate } from 'react-router'
// own
import BackendError from 'exceptions/backend-error'
import { useAppDispatch } from 'store/index'
import {
  setIsLoading,
  setSuccessMessage,
  setErrorMessage
} from 'store/customizationSlice'
import Form from '../form'
import { FormikHelpers } from 'formik'
import { FormValues } from '../form'
import editSchoolYear from 'services/school-year/edit-school-year'
import useSchoolYearById from './use-school-year-by-id'
import useSchoolYearId from './use-school-year-id'
import BreadcrumbsNav from 'components/BreadcrumbsNav'
import { SchoolLapse } from 'core/school-year/types'

const EditSchoolYear: FunctionComponent<Props> = ({ className }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const schoolYearId = useSchoolYearId()
  const schoolYear = useSchoolYearById(schoolYearId)

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
        
        await editSchoolYear(schoolYearId!, payload)

        navigate('/school-years')
        dispatch(
          setSuccessMessage(`Año Escolar ${values.code} editado correctamente`)
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
    [schoolYearId, navigate, dispatch]
  )

  const breadcrumbsItems = [
    {
      label: 'Años Escolares',
      path: '/school-years'
    },
    {
      label: 'Editar Año Escolar'
    }
  ];

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />
      
      {schoolYear && (
        <Form
          initialValues={{
            code: schoolYear.code,
            startDate: schoolYear.startDate,
            endDate: schoolYear.endDate,
            lapses: schoolYear.schoolLapses.map((lapse) => ({
              startDate: lapse.startDate,
              endDate: lapse.endDate,
              scholarCourts: lapse.schoolCourts.map((court) => ({
                startDate: court.startDate,
                endDate: court.endDate
              }))
            })),
            submit: null
          }}
          title={'Editar Año Escolar'}
          onSubmit={onSubmit}
          isUpdate={true}
        />
      )}
    </div>
  )
}

interface Props {
  className?: string
}

export default styled(EditSchoolYear)`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
`
