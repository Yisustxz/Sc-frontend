import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "store";
import { setErrorMessage, setIsLoading } from "store/customizationSlice";
import BackendError from "exceptions/backend-error";
import getAllSchoolYear from "services/school-year/get-all-school-year";
import { SchoolYearSelect } from "core/school-year/types";

/**
 * Hook para obtener años escolares con filtrado opcional
 * 
 * IMPORTANTE: Para evitar bucles infinitos de renderizado:
 * - NUNCA pases un array vacío inline como `[]`. Usa una constante fuera del componente.
 * - Si necesitas pasar un objeto con múltiples propiedades, usa useMemo para memoizarlo.
 * 
 * CORRECTO:
 * const EMPTY_ARRAY_REF = []; // Fuera del componente
 * const { data } = useGetSchoolYears(EMPTY_ARRAY_REF, searchTerm);
 * 
 * INCORRECTO:
 * const { data } = useGetSchoolYears([], searchTerm); // Causa bucles infinitos
 * 
 * @param forceItemsIds IDs de años escolares para forzar su inclusión
 * @param searchTerm Término de búsqueda para filtrar años escolares
 */
export default function useGetSchoolYears(forceItemsIds: number[] = [], searchTerm: string = '') {
  const [rawData, setRawData] = useState<SchoolYearSelect[]>([]);
  const dispatch = useAppDispatch();
  const { isLoading, setLoading } = useMixedLoading();

  const fetchSchoolYears = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllSchoolYear(searchTerm, forceItemsIds);
      setRawData(response);
    } catch (error) {
      if (error instanceof BackendError) {
        dispatch(setErrorMessage(error.getMessage()));
      }
      console.error("Error fetching school years:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, dispatch, searchTerm, forceItemsIds]);

  useEffect(() => {
    fetchSchoolYears();
  }, [fetchSchoolYears]);

  return {
    data: rawData,
    isLoading,
    refetch: fetchSchoolYears,
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
