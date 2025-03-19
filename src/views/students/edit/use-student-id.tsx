import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

export default function useStudentId() {
  const navigate = useNavigate()
  const params = useParams()

  const [studentId, setStudentId] = useState<number | null>(null)
  useEffect(() => {
    if (!params.id || isNaN(params.id as any)) {
      navigate('/students')
    }

    setStudentId(params.id as unknown as number)
  }, [navigate, params.id])

  return studentId
}
