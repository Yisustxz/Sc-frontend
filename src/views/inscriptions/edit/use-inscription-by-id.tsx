import { useCallback, useEffect, useState } from 'react'
// material-ui
import BackendError from 'exceptions/backend-error'
import { setIsLoading, setErrorMessage } from 'store/customizationSlice'
import { useAppDispatch } from '../../../store/index'
import { InscriptionDto } from 'core/inscriptions/types'
import getInscription from 'services/inscriptions/get-inscription'

export default function useInscriptionById(id: number | null) {
  const dispatch = useAppDispatch()
  const [inscription, setInscription] = useState<InscriptionDto | null>(null)

  const fetchInscription = useCallback(
    async (id: number) => {
      try {
        dispatch(setIsLoading(true))
        const response = await getInscription(id)
        setInscription(response)
      } catch (error) {
        if (error instanceof BackendError)
          dispatch(setErrorMessage(error.getMessage()))
      } finally {
        dispatch(setIsLoading(false))
      }
    },
    [dispatch]
  )

  useEffect(() => {
    if (id) fetchInscription(id)
  }, [fetchInscription, id])

  return inscription
} 