import { useState, useEffect, useCallback } from 'react';
import { setErrorMessage } from 'store/customizationSlice';
import store from 'store';
import BackendError from 'exceptions/backend-error';
import { Evaluation } from 'core/evaluations/types';
import getEvaluationsByCourseSchoolYear from 'services/evaluations/get-by-course-school-year';

/**
 * Hook para obtener evaluaciones por curso-año escolar
 * @param courseSchoolYearId ID del curso-año escolar
 * @returns Los datos de evaluaciones, estado de carga, error y función para recargar datos
 */
const useGetEvaluationsByCourseSchoolYear = (courseSchoolYearId?: number | null) => {
  const [data, setData] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar los datos
  const fetchEvaluations = useCallback(async () => {
    // Si no hay un curso-año escolar seleccionado, no hacemos petición
    if (!courseSchoolYearId) {
      setData([]);
      return;
    }

    try {
      setIsLoading(true);
      const evaluationsData = await getEvaluationsByCourseSchoolYear(courseSchoolYearId);
      setData(evaluationsData || []);
    } catch (error: any) {
      console.error('Error fetching evaluations:', error);
      setError(error);
      
      if (error instanceof BackendError) {
        store.dispatch(setErrorMessage(error.getMessage()));
      } else {
        store.dispatch(setErrorMessage('Error al cargar evaluaciones'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [courseSchoolYearId]);

  // Cargar datos cuando cambien las dependencias
  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  return { 
    data, 
    isLoading, 
    error,
    refetch: fetchEvaluations 
  };
};

export default useGetEvaluationsByCourseSchoolYear;
