import { useState, useEffect } from 'react';
import { EvaluationDetails } from 'core/evaluations/types';
import BackendError from 'exceptions/backend-error';
import getAllEvaluations, { GetAllEvaluationsParams } from 'services/evaluations/get-all-evaluations';

interface UseGetEvaluationsReturn {
  data: EvaluationDetails[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook para obtener evaluaciones con búsqueda opcional
 * @param searchTerm Término de búsqueda opcional
 * @returns Datos de evaluaciones, estado de carga, errores y función para recargar
 */
const useGetEvaluations = (searchTerm?: string): UseGetEvaluationsReturn => {
  const [data, setData] = useState<EvaluationDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvaluations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Preparar parámetros para la búsqueda
      const params: GetAllEvaluationsParams = {};
      if (searchTerm) {
        params.searchTerm = searchTerm;
      }
      
      const response = await getAllEvaluations(params);
      setData(response.items || []);
    } catch (err: any) {
      console.error('Error fetching evaluations:', err);
      setError(err instanceof Error ? err : new BackendError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para cargar los datos cuando cambia el término de búsqueda
  useEffect(() => {
    fetchEvaluations();
  }, [searchTerm]);

  // Función para recargar los datos manualmente
  const refetch = () => {
    fetchEvaluations();
  };

  return {
    data,
    isLoading,
    error,
    refetch
  };
};

export default useGetEvaluations; 