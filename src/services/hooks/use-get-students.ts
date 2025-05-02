import { useCallback, useEffect, useState } from "react";
import { Students } from "core/students/types";
import { useAppDispatch } from "store";
import { setErrorMessage, setIsLoading } from "store/customizationSlice";
import BackendError from "exceptions/backend-error";
import getAllStudents, { GetAllStudentsParams } from "services/students/get-all-students";

// Constante para evitar crear un array vacío en cada renderizado
const EMPTY_REFERENCE_ARRAY: number[] = [];

export default function useGetStudents(forceItemsIds: number[] = EMPTY_REFERENCE_ARRAY, searchTerm: string = '', limit: number | null = null) {
  const [rawData, setRawData] = useState<Students[]>([]);
  const dispatch = useAppDispatch();
  const { isLoading, setLoading } = useMixedLoading();

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await executeGetStudents(forceItemsIds, searchTerm, limit);
      setRawData(response);
    } catch (error) {
      if (error instanceof BackendError) {
        dispatch(setErrorMessage(error.getMessage()));
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, forceItemsIds, limit, searchTerm, setLoading]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    data: rawData,
    isLoading,
    refetch: fetchStudents,
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

async function executeGetStudents(forceItemsIds: number[], searchTerm: string, limit: number | null): Promise<Students[]> {
  const params: GetAllStudentsParams = {};

  if (searchTerm) {
    params.searchTerm = searchTerm;
  }

  if (limit) {
    params.limit = limit;
  }

  if (forceItemsIds && forceItemsIds.length > 0) {
    params.forceItemsIds = forceItemsIds;
  }

  return await getAllStudents(params);
} 