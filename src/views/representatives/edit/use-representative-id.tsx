import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

export default function useRepresentativeId() {
  const navigate = useNavigate()
  const params = useParams()

  const [representativeId, setrepresentativeId] = useState<number | null>(null)
  useEffect(() => {
    if (!params.id || isNaN(params.id as any)) {
      navigate('/representatives')
    }

    setrepresentativeId(params.id as unknown as number)
  }, [navigate, params.id])

  return representativeId
}
