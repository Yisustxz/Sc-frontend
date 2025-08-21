import { useState, useEffect } from 'react';
import { EvaluationDetails } from 'core/evaluations/types';
import BackendError from 'exceptions/backend-error';
import getEvaluationById from 'services/evaluations/get-by-id';

interface UseEvaluationByIdReturn {
  evaluation: EvaluationDetails | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook para obtener los detalles de una evaluación por su ID
 * @param evaluationId ID de la evaluación a obtener
 * @returns Datos de la evaluación, estado de carga y errores
 */
const useEvaluationById = (evaluationId: number | null): UseEvaluationByIdReturn => {
  const [evaluation, setEvaluation] = useState<EvaluationDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvaluation = async () => {
    // Si no hay ID, no hacer nada
    if (!evaluationId) {
      setEvaluation(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getEvaluationById(evaluationId);
      setEvaluation(data);
    } catch (err: any) {
      console.error(`Error fetching evaluation with ID ${evaluationId}:`, err);
      setError(err instanceof Error ? err : new BackendError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para cargar los datos cuando cambia el ID
  useEffect(() => {
    fetchEvaluation();
  }, [evaluationId]);

  // Función para recargar los datos manualmente
  const refetch = () => {
    fetchEvaluation();
  };

  return {
    evaluation,
    isLoading,
    error,
    refetch
  };
};

export default useEvaluationById; 