import { useCallback, useEffect, useState, useMemo } from "react";
import { Employees, TypeEmployee } from "core/employees/types";
import { useAppDispatch } from "store";
import { setErrorMessage, setIsLoading } from "store/customizationSlice";
import BackendError from "exceptions/backend-error";
import getAllEmployees, { GetAllEmployeesParams } from "services/employees/get-all-employees";

interface ForcedEmployee extends Partial<Omit<Employees,'id'>>{
  id: number;
}


export default function useGetEmployees (forceItems: ForcedEmployee[], searchTerm: string | null, limit: number | null, employeeType: TypeEmployee | null) {
  const [rawData, setRawData] = useState<Employees[]>([]);
  const dispatch = useAppDispatch();
  const { isLoading, setLoading } = useMixedLoading();

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const response = await executeGetEmployees(employeeType, searchTerm, limit);
      setRawData(response);
    } catch (error) {
      if (error instanceof BackendError) {
        dispatch(setErrorMessage(error.getMessage()));
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, employeeType, limit, searchTerm, setLoading]);
  
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const data = useItemsWithForcedItems(rawData, forceItems || []);

  return {
    data,
    isLoading,
    refetch: fetchEmployees,
  };
}; 

function useItemsWithForcedItems(rawData: Employees[], forceItems: ForcedEmployee[]) {
  return useMemo(() => {
    let result = [...rawData];

    forceItems.forEach(forcedItem => {
      const exists = result.some(item => item.id === forcedItem.id);

      if (!exists) {
        result.push({
          name: "",
          lastName: "",
          dni: "",
          phone: "",
          direction: "",
          birthDate: "",
          employeeType: TypeEmployee.Professor,
          ...forcedItem,
        });
      }
    });

    return result;
  }, [forceItems, rawData]);
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

async function executeGetEmployees(employeeType: TypeEmployee | null, searchTerm: string | null, limit: number | null): Promise<Employees[]> {
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

  return await getAllEmployees(params);
}
