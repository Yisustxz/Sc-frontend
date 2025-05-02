import { FunctionComponent, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import InscriptionForm, { FormValues } from './form'
import BreadcrumbsNav from 'components/BreadcrumbsNav'
import styled from 'styled-components'
import { FormikHelpers } from 'formik'
import axios from 'axios'
import BackendError from 'exceptions/backend-error'
import {
  setErrorMessage,
  setIsLoading,
  setSuccessMessage
} from 'store/customizationSlice'
import { useAppDispatch } from 'store'
import { CreateInscriptionDto } from 'core/inscriptions/types'

const CreateInscription: FunctionComponent<Props> = ({ className }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Valores iniciales del formulario
  const initialValues: FormValues = {
    studentId: 0,
    schoolYearId: 0,
    grade: '',
    courseInscriptions: [],
    submit: null
  }

  // Manejador de envío del formulario
  const handleSubmit = useCallback(
    async (
      values: FormValues,
      { setErrors, setStatus, setSubmitting }: FormikHelpers<FormValues>
    ) => {
      try {
        dispatch(setIsLoading(true))
        setErrors({})
        setStatus({})
        setSubmitting(true)
        
        // Preparar payload según el tipo adecuado
        const payload: CreateInscriptionDto = {
          studentId: values.studentId,
          schoolYearId: values.schoolYearId,
          grade: values.grade,
          courseInscriptions: values.courseInscriptions?.map(item => ({
            courseSchoolYearId: item.courseSchoolYearId
          })) || []
        }
        
        // Enviar los datos al backend
        await axios.post('/api/inscriptions', payload)

        // Mostrar mensaje de éxito y redireccionar
        navigate('/inscriptions')
        dispatch(
          setSuccessMessage('Inscripción creada correctamente')
        )
      } catch (error) {
        if (error instanceof BackendError) {
          setErrors({
            ...error.getFieldErrorsMessages(),
            submit: error.getMessage()
          })
          dispatch(setErrorMessage(error.getMessage()))
        } else {
          console.error(error)
          setErrors({
            submit: 'Error al crear la inscripción'
          })
          dispatch(setErrorMessage('Hubo un problema al crear la inscripción'))
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
      label: 'Inscripciones',
      path: '/inscriptions'
    },
    {
      label: 'Crear Inscripción'
    }
  ];

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />

      <InscriptionForm
        title="Crear Nueva Inscripción"
        onSubmit={handleSubmit}
        initialValues={initialValues}
      />
    </div>
  )
}

interface Props {
  className?: string
}

export default styled(CreateInscription)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
` 