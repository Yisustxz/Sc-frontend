import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch } from 'store/index'
import { setErrorMessage, setIsLoading } from 'store/customizationSlice'
import BackendError from 'exceptions/backend-error'
import { SchoolYear } from 'core/school-year/types'
import getSchoolYear from 'services/school-year/get-school-year'

export default function useSchoolYearById(id: number | null) {
  const dispatch = useAppDispatch()
  const [schoolYear, setSchoolYear] = useState<SchoolYear | null>(null)

  const fetchSchoolYear = useCallback(
    async (id: number) => {
      try {
        dispatch(setIsLoading(true))
        const response = await getSchoolYear(id)
        setSchoolYear(response)
      } catch (error) {
        if (error instanceof BackendError) {
          dispatch(setErrorMessage(error.getMessage()))
        }
      } finally {
        dispatch(setIsLoading(false))
      }
    },
    [dispatch]
  )

  useEffect(() => {
    if (id) fetchSchoolYear(id)
  }, [fetchSchoolYear, id])

  return schoolYear
} 