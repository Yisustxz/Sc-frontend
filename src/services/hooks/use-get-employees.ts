import { useCallback, useEffect, useState } from "react";
import { Employees, TypeEmployee } from "core/employees/types";
import { useAppDispatch } from "store";
import { setErrorMessage, setIsLoading } from "store/customizationSlice";
import BackendError from "exceptions/backend-error";
import getAllEmployees, { GetAllEmployeesParams } from "services/employees/get-all-employees";

/**
 * Hook para obtener empleados con filtrado opcional
 * 
 * IMPORTANTE: Para evitar bucles infinitos de renderizado:
 * - NUNCA pases un array vacío inline como `[]`. Usa una constante fuera del componente.
 * - NUNCA pases un objeto inline. Usa useMemo o una variable de estado.
 * 
 * CORRECTO:
 * const EMPTY_ARRAY_REF = []; // Fuera del componente
 * const { data } = useGetEmployees(EMPTY_ARRAY_REF, null, null, null);
 * 
 * INCORRECTO:
 * const { data } = useGetEmployees([], null, null, null); // Causa bucles infinitos
 * 
 * @param forceItemsIds IDs de empleados para forzar su inclusión
 * @param searchTerm Término de búsqueda
 * @param limit Límite de resultados
 * @param employeeType Tipo de empleado (profesor, trabajador, etc.)
 */
export default function useGetEmployees (forceItemsIds: number[], searchTerm: string | null, limit: number | null, employeeType: TypeEmployee | null) {
  const [rawData, setRawData] = useState<Employees[]>([]);
  const dispatch = useAppDispatch();
  const { isLoading, setLoading } = useMixedLoading();

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const response = await executeGetEmployees(forceItemsIds, employeeType, searchTerm, limit);
      setRawData(response);
    } catch (error) {
      if (error instanceof BackendError) {
        dispatch(setErrorMessage(error.getMessage()));
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, employeeType, forceItemsIds, limit, searchTerm, setLoading]);
  
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);


  return {
    data: rawData,
    isLoading,
    refetch: fetchEmployees,
  };
}; 

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

async function executeGetEmployees(forceItemsIds: number[], employeeType: TypeEmployee | null, searchTerm: string | null, limit: number | null): Promise<Employees[]> {
  const params: GetAllEmployeesParams = {};

  if (employeeType) {
    params.employeeType = employeeType;
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

  return await getAllEmployees(params);
}
