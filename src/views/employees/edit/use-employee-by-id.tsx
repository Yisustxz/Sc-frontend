import { useCallback, useEffect, useState } from 'react'
// material-ui
import BackendError from 'exceptions/backend-error'
import { setIsLoading, setErrorMessage } from 'store/customizationSlice'
import { useAppDispatch } from '../../../store/index'
import { Employees } from 'core/employees/types'
import getEmployee from 'services/employees/get-employee'

export default function useEmployeeById(id: number | null) {
  const dispatch = useAppDispatch()
  const [employee, setEmployee] = useState<Employees | null>(null)

  const fetchEmployee = useCallback(
    async (id: number) => {
      try {
        dispatch(setIsLoading(true))
        const response = await getEmployee(id)
        setEmployee(response)
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
    if (id) fetchEmployee(id)
  }, [fetchEmployee, id])

  return employee
}
