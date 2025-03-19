import { useCallback, useEffect, useState } from 'react'
// material-ui
import BackendError from 'exceptions/backend-error'
import { setIsLoading, setErrorMessage } from 'store/customizationSlice'
import { useAppDispatch } from '../../../store/index'
import { Students } from 'core/students/types'
import getStudent from 'services/students/get-student'

export default function useStudentById(id: number | null) {
  const dispatch = useAppDispatch()
  const [student, setStudent] = useState<Students | null>(null)

  const fetchStudent = useCallback(
    async (id: number) => {
      try {
        dispatch(setIsLoading(true))
        const response = await getStudent(id)
        setStudent(response)
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
    if (id) fetchStudent(id)
  }, [fetchStudent, id])

  return student
}
