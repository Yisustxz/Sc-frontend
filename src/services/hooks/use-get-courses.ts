import { useCallback, useEffect, useState } from "react";
import getAllCourses from "services/courses/get-all-courses";
import { Course } from "core/courses/types";
import { useAppDispatch } from "store";
import { setErrorMessage, setIsLoading } from "store/customizationSlice";
import BackendError from "exceptions/backend-error";

/**
 * Hook para obtener cursos con filtrado opcional
 * 
 * IMPORTANTE: Para evitar bucles infinitos de renderizado:
 * - NUNCA pases un array vacío inline como `[]`. Usa una constante fuera del componente.
 * - NUNCA pases un objeto inline como `{}`. Usa useMemo o una variable de estado.
 * 
 * CORRECTO:
 * const EMPTY_ARRAY_REF = []; // Fuera del componente
 * const { data } = useGetCourses(EMPTY_ARRAY_REF, null, null, null);
 * 
 * INCORRECTO:
 * const { data } = useGetCourses([], null, null, null); // Causa bucles infinitos
 * 
 * @param forceItemsIds IDs de cursos para forzar su inclusión
 * @param searchTerm Término de búsqueda
 * @param limit Límite de resultados
 * @param grade Filtro por grado
 */
export default function useGetCourses(forceItemsIds: number[],  searchTerm: string | null, limit: number | null, grade: number | null) {
  const [rawData, setRawData] = useState<Course[]>([]);
  const dispatch = useAppDispatch();
  const { isLoading, setLoading } = useMixedLoading();

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await executeGetCourses(grade, searchTerm, limit, forceItemsIds);
      setRawData(response);
    } catch (error) {
      if (error instanceof BackendError) {
        dispatch(setErrorMessage(error.getMessage()));
      }
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, grade, searchTerm, limit, forceItemsIds, dispatch]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    data: rawData,
    isLoading,
    refetch: fetchCourses,
  };
}

function useMixedLoading() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoadingState] = useState(false);

  const setLoading = useCallback((loading: boolean) => {
    // Local Loading
    setIsLoadingState(loading);
  
    // Global Loading
    dispatch(setIsLoading(loading));
  }, [dispatch]);
  
  return { isLoading, setLoading }
}

async function executeGetCourses(grade: number | null, searchTerm: string | null, limit: number | null, forceItemsIds: number[]): Promise<Course[]> {
  const params: any = {};

  if (grade) {
    params.grade = grade;
  }

  if (searchTerm) {
    params.name = searchTerm;
  }

  if (limit) {
    params.limit = limit;
  }

  if (forceItemsIds) {
    params.forceItemsIds = forceItemsIds;
  }

  return await getAllCourses(params);
}
