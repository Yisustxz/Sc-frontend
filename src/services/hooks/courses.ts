import { useCallback, useEffect, useState } from "react";
import getAllCourses from "services/courses/get-all-courses";
import getPaginate from "services/courses/get-paginate";
import { Course } from "core/courses/types";
import { useAppDispatch } from "store";
import { setErrorMessage, setIsLoading } from "store/customizationSlice";
import BackendError from "exceptions/backend-error";
import { PaginateBody } from "services/types";

interface UseGetCoursesProps {
  grade?: number;
  searchTerm?: string;
}

/**
 * Hook para obtener cursos
 * @param props Propiedades para filtrar cursos
 * @returns Lista de cursos y estado de carga
 */
export const useGetCourses = (props?: UseGetCoursesProps) => {
  const { grade, searchTerm } = props || {};
  const [data, setData] = useState<Course[]>([]);
  const [isLoading, setIsLoadingState] = useState(false);
  const dispatch = useAppDispatch();

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoadingState(true);
      dispatch(setIsLoading(true));

      // Usamos el método getAllCourses con los parámetros de filtro
      const courses = await getAllCourses({
        grade: grade,
        name: searchTerm
      });
      setData(courses);
    } catch (error) {
      if (error instanceof BackendError) {
        dispatch(setErrorMessage(error.getMessage()));
      }
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoadingState(false);
      dispatch(setIsLoading(false));
    }
  }, [dispatch, grade, searchTerm]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    data,
    isLoading,
    refetch: fetchCourses,
  };
}; 