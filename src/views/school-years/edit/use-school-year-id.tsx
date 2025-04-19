import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function useSchoolYearId() {
  const params = useParams()

  // El ID guardado como estado para poder hacer peticiones que dependan de él
  const [schoolYearId, setSchoolYearId] = useState<number | null>(null)

  useEffect(() => {
    if (params.id) {
      // Convertimos el string id a number
      setSchoolYearId(params.id as unknown as number)
    }
  }, [params])

  return schoolYearId
} 