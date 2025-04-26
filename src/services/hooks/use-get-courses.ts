import { useCallback, useEffect, useState } from "react";
import getAllCourses from "services/courses/get-all-courses";
import { Course } from "core/courses/types";
import { useAppDispatch } from "store";
import { setErrorMessage, setIsLoading } from "store/customizationSlice";
import BackendError from "exceptions/backend-error";


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
