import { FunctionComponent, useEffect, useMemo, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BreadcrumbsNav from 'components/BreadcrumbsNav'
import Form, { FormValues } from '../form'
import { CircularProgress, Box } from '@mui/material'
import styled from 'styled-components'
import getSchoolYear from 'services/school-year/get-school-year'
import editSchoolYear from 'services/school-year/edit-school-year'
import { mapSchoolYearToFormValues, mapFormValuesToPayload } from '../utils/mappers'
import { SchoolYear } from 'core/school-year/types'
import { FormikHelpers } from 'formik'
import { useAppDispatch } from 'store'
import { setErrorMessage, setIsLoading, setSuccessMessage } from 'store/customizationSlice'
import BackendError from 'exceptions/backend-error'

interface Props {
  className?: string
}

const EditSchoolYear: FunctionComponent<Props> = ({ className }) => {
  const params = useParams<{id: string}>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const id = parseInt(params.id as string)

  const [loading, setLoading] = useState(true)
  const [schoolYear, setSchoolYear] = useState<SchoolYear | null>(null)

  useEffect(() => {
    if (isNaN(id)) {
      navigate('/school-year')
      return
    }

    const fetchData = async () => {
      try {
        const data = await getSchoolYear(id)
        setSchoolYear(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching school year:', error)
        navigate('/school-year')
      }
    }

    fetchData()
  }, [id, navigate])

  const breadcrumbsItems = useMemo(() => [
    {
      label: 'Año Escolar',
      path: '/school-years'
    },
    {
      label: 'Editar Año Escolar',
      path: `/school-years/edit/${id}`,
      active: true
    }
  ], [id])

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
        await editSchoolYear(id, payload)
        navigate('/school-years')
        dispatch(
          setSuccessMessage(
            `Año escolar ${values.code} actualizado correctamente`
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
            submit: 'Error al actualizar el año escolar'
          })
          dispatch(setErrorMessage('Error al actualizar el año escolar'))
        }
        setStatus({ success: 'false' })
      } finally {
        dispatch(setIsLoading(false))
        setSubmitting(false)
      }
    },
    [dispatch, navigate, id]
  )

  if (loading) {
    return (
      <Box className={className} display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />
      
      {schoolYear && (
        <Form
          initialValues={mapSchoolYearToFormValues(schoolYear)}
          title={'Editar Año Escolar'}
          onSubmit={onSubmit}
          isUpdate={true}
        />
      )}
    </div>
  )
}

export default styled(EditSchoolYear)`
  width: 100%;
  
  .MuiCircularProgress-root {
    color: #3f51b5;
  }
`
