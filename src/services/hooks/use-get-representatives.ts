import { useCallback, useEffect, useState } from "react";
import { Representatives } from "core/representatives/types";
import { useAppDispatch } from "store";
import { setErrorMessage, setIsLoading } from "store/customizationSlice";
import BackendError from "exceptions/backend-error";
import getAllRepresentatives, { GetAllRepresentativesParams } from "services/representatives/get-all-representatives";

export default function useGetRepresentatives(forceItemsIds: number[], searchTerm: string | null, limit: number | null) {
  const [rawData, setRawData] = useState<Representatives[]>([]);
  const dispatch = useAppDispatch();
  const { isLoading, setLoading } = useMixedLoading();

  const fetchRepresentatives = useCallback(async () => {
    try {
      setLoading(true);
      const response = await executeGetRepresentatives(forceItemsIds, searchTerm, limit);
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
    fetchRepresentatives();
  }, [fetchRepresentatives]);

  return {
    data: rawData,
    isLoading,
    refetch: fetchRepresentatives,
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

async function executeGetRepresentatives(forceItemsIds: number[], searchTerm: string | null, limit: number | null): Promise<Representatives[]> {
  const params: GetAllRepresentativesParams = {};

  if (searchTerm) {
    params.searchTerm = searchTerm;
  }

  if (limit) {
    params.limit = limit;
  }

  if (forceItemsIds && forceItemsIds.length > 0) {
    params.forceItemsIds = forceItemsIds;
  }

  return await getAllRepresentatives(params);
} 
