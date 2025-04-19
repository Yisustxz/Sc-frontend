import { FunctionComponent, useCallback } from 'react'
// material-ui
import styled from 'styled-components'
import { useNavigate } from 'react-router'
// own
import BackendError from 'exceptions/backend-error'
import { useAppDispatch } from '../../../store/index'
import {
  setIsLoading,
  setSuccessMessage,
  setErrorMessage
} from 'store/customizationSlice'
import Form, { FormValues } from '../form'
import editSchoolarYear from 'services/schoolar-year/edit-schoolar-year'
import useSchoolarYearById from './use-schoolar-year-by-id'
import useSchoolarYearId from './use-schoolar-year-id'
import { FormikHelpers } from 'formik'
import BreadcrumbsNav from 'components/BreadcrumbsNav'

const EditSchoolarYear: FunctionComponent<Props> = ({ className }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const schoolarYearId = useSchoolarYearId()
  const schoolarYear = useSchoolarYearById(schoolarYearId)

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
          lapses: values.lapses.map((lapse, index) => ({
            lapseNumber: index + 1,
            startDate: lapse.startDate,
            endDate: lapse.endDate,
            scholarCourts: lapse.scholarCourts
          }))
        }

        await editSchoolarYear(schoolarYearId!, payload)

        navigate('/schoolar-year')
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
    [schoolarYearId, navigate, dispatch]
  )

  const breadcrumbsItems = [
    {
      label: 'Años Escolares',
      path: '/schoolar-year'
    },
    {
      label: 'Editar Año Escolar'
    }
  ];

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />
      
      {schoolarYear && (
        <Form
          isUpdate={true}
          initialValues={{
            code: schoolarYear.code,
            startDate: schoolarYear.startDate,
            endDate: schoolarYear.endDate,
            lapses: schoolarYear.lapses.map((lapse) => ({
              startDate: lapse.startDate,
              endDate: lapse.endDate,
              scholarCourts: Array.isArray(lapse.scholarCourts)
                ? lapse.scholarCourts
                : []
            })),
            submit: null
          }}
          title={'Editar Año Escolar'}
          onSubmit={onSubmit}
        />
      )}
    </div>
  )
}

interface Props {
  className?: string
}

export default styled(EditSchoolarYear)`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
`
