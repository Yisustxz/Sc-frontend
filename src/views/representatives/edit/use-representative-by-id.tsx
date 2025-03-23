import { useCallback, useEffect, useState } from 'react'
// material-ui
import BackendError from 'exceptions/backend-error'
import { setIsLoading, setErrorMessage } from 'store/customizationSlice'
import { useAppDispatch } from '../../../store/index'
import { Representatives } from 'core/representatives/types'
import getRepresentative from 'services/representatives/get-representative'

export default function useRepresentativeById(id: number | null) {
  const dispatch = useAppDispatch()
  const [representative, setRepresentative] = useState<Representatives | null>(
    null
  )

  const fetchRepresentative = useCallback(
    async (id: number) => {
      try {
        dispatch(setIsLoading(true))
        const response = await getRepresentative(id)
        setRepresentative(response)
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
    if (id) fetchRepresentative(id)
  }, [fetchRepresentative, id])

  return representative
}
