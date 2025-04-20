import { useCallback, useEffect, useState } from "react";
import { Employees } from "core/employees/types";
import { useAppDispatch } from "store";
import { setErrorMessage, setIsLoading } from "store/customizationSlice";
import BackendError from "exceptions/backend-error";
import getAllEmployees, { GetAllEmployeesParams } from "services/employees/get-all-employees";

interface UseGetEmployeesProps {
  role?: string; // PROFESSOR, ADMIN, etc.
  searchTerm?: string;
}

/**
 * Hook para obtener empleados, usando el endpoint getAllEmployees
 * @param props Propiedades para filtrar empleados
 * @returns Lista de empleados y estado de carga
 */
export const useGetEmployees = (props?: UseGetEmployeesProps) => {
  const { role, searchTerm } = props || {};
  const [data, setData] = useState<Employees[]>([]);
  const [isLoading, setIsLoadingState] = useState(false);
  const dispatch = useAppDispatch();

  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoadingState(true);
      dispatch(setIsLoading(true));

      // Crear objeto de parámetros para la llamada a la API
      const params: GetAllEmployeesParams = {};

      // Si hay un rol especificado, mapearlo al formato del backend
      if (role) {
        // Convertir PROFESSOR a lowercase para que coincida con el enum del backend
        params.employeeType = role.toLowerCase();
      }

      // Si hay un término de búsqueda, añadirlo a los parámetros
      if (searchTerm) {
        params.name = searchTerm;
      }

      // Llamar a getAllEmployees con los parámetros
      const response = await getAllEmployees(params);
      setData(response);
    } catch (error) {
      if (error instanceof BackendError) {
        dispatch(setErrorMessage(error.getMessage()));
      }
      console.error("Error fetching employees:", error);
    } finally {
      setIsLoadingState(false);
      dispatch(setIsLoading(false));
    }
  }, [dispatch, role, searchTerm]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    data,
    isLoading,
    refetch: fetchEmployees,
  };
}; 