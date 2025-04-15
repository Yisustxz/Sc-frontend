import { useCallback, useEffect, useState } from 'react'
// material-ui
import BackendError from 'exceptions/backend-error'
import { setIsLoading, setErrorMessage } from 'store/customizationSlice'
import { useAppDispatch } from '../../../store/index'
import { SchoolarYear } from 'core/schoolar-year/types'
import getSchoolarYear from 'services/schoolar-year/get-schoolar-year'

export default function useSchoolarYearById(id: number | null) {
  const dispatch = useAppDispatch()
  const [schoolarYear, setSchoolarYear] = useState<SchoolarYear | null>(null)

  const fetchSchoolarYear = useCallback(
    async (id: number) => {
      try {
        dispatch(setIsLoading(true))
        const response = await getSchoolarYear(id)
        setSchoolarYear(response)
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
    if (id) fetchSchoolarYear(id)
  }, [fetchSchoolarYear, id])

  return schoolarYear
}
