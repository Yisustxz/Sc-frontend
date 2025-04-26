import { useCallback, useEffect, useState, useMemo } from "react";
import getAllCourses from "services/courses/get-all-courses";
import { Course } from "core/courses/types";
import { useAppDispatch } from "store";
import { setErrorMessage, setIsLoading } from "store/customizationSlice";
import BackendError from "exceptions/backend-error";

// Interfaz para los elementos forzados usando Partial para hacer opcional todos los campos excepto id
interface ForcedCourse extends Partial<Omit<Course, 'id'>> {
  id: number;
}

export default function useGetCourses(forceItems: ForcedCourse[],  searchTerm: string | null, limit: number | null, grade: number | null) {
  const [rawData, setRawData] = useState<Course[]>([]);
  const dispatch = useAppDispatch();
  const { isLoading, setLoading } = useMixedLoading();

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await executeGetCourses(grade, searchTerm, limit);
      setRawData(response);
    } catch (error) {
      if (error instanceof BackendError) {
        dispatch(setErrorMessage(error.getMessage()));
      }
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, grade, searchTerm, limit, setLoading]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Utiliza la función extraída para procesar los items forzados
  const data = useItemsWithForcedItems(rawData, forceItems || []);

  return {
    data,
    isLoading,
    refetch: fetchCourses,
  };
}

function useItemsWithForcedItems(rawData: Course[], forceItems: ForcedCourse[]) {
  return useMemo(() => {
    let result = [...rawData];

    forceItems.forEach(forcedItem => {
      const exists = result.some(item => item.id === forcedItem.id);

      if (!exists) {
        result.push({
          name: forcedItem.name || "(Sin nombre)",
          grade: forcedItem.grade || 1,
          createdAt: forcedItem.createdAt || new Date().toISOString(),
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

async function executeGetCourses(grade: number | null, searchTerm: string | null, limit: number | null): Promise<Course[]> {
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

  return await getAllCourses(params);
}
