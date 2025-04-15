import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

export default function useSchoolarYearId() {
  const navigate = useNavigate()
  const params = useParams()

  const [schoolarYearId, setschoolarYearId] = useState<number | null>(null)
  useEffect(() => {
    if (!params.id || isNaN(params.id as any)) {
      navigate('/representatives')
    }

    setschoolarYearId(params.id as unknown as number)
  }, [navigate, params.id])

  return schoolarYearId
}
