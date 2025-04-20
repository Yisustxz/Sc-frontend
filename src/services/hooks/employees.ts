import { useCallback, useEffect, useState } from "react";
import getPaginate from "services/employees/get-paginate";
import { Employees } from "core/employees/types";
import { useAppDispatch } from "store";
import { setErrorMessage, setIsLoading } from "store/customizationSlice";
import BackendError from "exceptions/backend-error";
import { PaginateBody } from "services/types";

interface UseGetEmployeesProps {
  role?: string; // PROFESSOR, ADMIN, etc.
  searchTerm?: string;
}

/**
 * Hook para obtener empleados
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

      const filters: Partial<PaginateBody> = {
        page: 1,
        size: 100,
      };

      if (role) {
        // @ts-ignore - La API soporta role como filtro opcional
        filters.role = role;
      }

      if (searchTerm) {
        // @ts-ignore - La API soporta name como filtro opcional
        filters.name = searchTerm;
      }

      const response = await getPaginate(filters as PaginateBody);
      setData(response.items);
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