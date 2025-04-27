import { useCallback, useEffect, useState } from 'react'
// material-ui
import BackendError from 'exceptions/backend-error'
import { setIsLoading, setErrorMessage } from 'store/customizationSlice'
import { useAppDispatch } from '../../../store/index'
import { CourseSchoolYear } from 'core/course-school-year/types'
import getCourseSchoolYear from 'services/course-school-year/get-course-school-year'

export default function useCourseSchoolYearById(id: number | null) {
  const dispatch = useAppDispatch()
  const [courseSchoolYear, setCourseSchoolYear] = useState<CourseSchoolYear | null>(null)

  const fetchCourseSchoolYear = useCallback(
    async (id: number) => {
      try {
        dispatch(setIsLoading(true))
        const response = await getCourseSchoolYear(id)
        setCourseSchoolYear(response)
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
    if (id) fetchCourseSchoolYear(id)
  }, [fetchCourseSchoolYear, id])

  return courseSchoolYear
} 