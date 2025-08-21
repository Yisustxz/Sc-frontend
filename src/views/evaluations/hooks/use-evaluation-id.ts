import { useParams } from 'react-router-dom'

/**
 * Hook para obtener el ID de la evaluación desde los parámetros de URL
 * @returns El ID de la evaluación como número o null si no es válido
 */
const useEvaluationId = (): number | null => {
  const { id } = useParams<{ id: string }>()
  
  if (!id) {
    return null
  }
  
  const evaluationId = parseInt(id, 10)
  
  // Verificar que sea un número válido
  if (isNaN(evaluationId) || evaluationId <= 0) {
    return null
  }
  
  return evaluationId
}

export default useEvaluationId 