import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

export default function useEmployeeId() {
  const navigate = useNavigate()
  const params = useParams()

  const [employeeId, setemployeeId] = useState<number | null>(null)
  useEffect(() => {
    if (!params.id || isNaN(params.id as any)) {
      navigate('/employees')
    }

    setemployeeId(params.id as unknown as number)
  }, [navigate, params.id])

  return employeeId
}
