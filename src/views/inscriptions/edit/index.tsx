import { FunctionComponent, useCallback, useMemo } from 'react'
// material-ui
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
import updateInscription from 'services/inscriptions/update-inscription'
import useInscriptionById from '../hooks/use-inscription-by-id'
import useInscriptionId from '../hooks/use-inscription-id'
import { FormikHelpers } from 'formik'
import BreadcrumbsNav from 'components/BreadcrumbsNav'

const EditInscription: FunctionComponent<Props> = ({ className }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const inscriptionId = useInscriptionId()
  const inscription = useInscriptionById(inscriptionId)

  const onSubmit = useCallback(
    async (
      values: FormValues,
      { setErrors, setStatus, setSubmitting }: FormikHelpers<FormValues>
    ) => {
      try {
        if (!inscriptionId) return;

        dispatch(setIsLoading(true))
        setErrors({})
        setStatus({})
        setSubmitting(true)

        // Preparar payload para actualización
        const payload = {
          grade: +values.grade,
          schoolYearId: values.schoolYearId,
          courseInscriptions: values.courseInscriptions?.map(item => ({
            courseSchoolYearId: item.courseSchoolYearId
          })) || []
        };

        await updateInscription(inscriptionId, payload)
        navigate('/inscriptions')
        dispatch(
          setSuccessMessage('Inscripción actualizada correctamente')
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
            submit: 'Error al actualizar la inscripción'
          })
          dispatch(setErrorMessage('Hubo un problema al actualizar la inscripción'))
        }
        setStatus({ success: 'false' })
      } finally {
        dispatch(setIsLoading(false))
        setSubmitting(false)
      }
    },
    [inscriptionId, navigate, dispatch]
  )

  const initialValues: FormValues = useMemo(() => {
    return {
      studentId: inscription?.studentId || 0,
      schoolYearId: inscription?.schoolYearId || 0,
      grade: inscription?.grade || '',
      courseInscriptions: inscription?.courseInscriptions?.map(item => ({
        courseSchoolYearId: item.courseSchoolYearId
      })) || [],
      submit: null
    }
  }, [inscription?.studentId, inscription?.schoolYearId, inscription?.grade, inscription?.courseInscriptions]);

  const breadcrumbsItems = [
    {
      label: 'Inscripciones',
      path: '/inscriptions'
    },
    {
      label: 'Editar Inscripción'
    }
  ];

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />

      {inscription && (
        <Form
          isUpdate={true}
          initialValues={initialValues}
          title={'Editar Inscripción'}
          onSubmit={onSubmit}
        />
      )}
    </div>
  )
}

interface Props {
  className?: string
}

export default styled(EditInscription)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
`;
