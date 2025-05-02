import { useState, useEffect, useCallback } from 'react';
import { setErrorMessage } from 'store/customizationSlice';
import store from 'store';
import BackendError from 'exceptions/backend-error';

import { 
  CourseSchoolYearDto, 
  getAllCourseSchoolYears
} from 'services/course-school-year/get-all-course-school-years';

/**
 * Hook para obtener cursos por año escolar
 * @param schoolYearId ID del año escolar
 * @param grade Grado opcional para filtrar
 * @returns Los datos de cursos, estado de carga, error y función para recargar datos
 */
const useGetCoursesSchoolYear = (schoolYearId: number, grade?: string) => {
  const [data, setData] = useState<CourseSchoolYearDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar los datos
  const fetchCourses = useCallback(async () => {
    // Si no hay un año escolar seleccionado, no hacemos petición
    if (!schoolYearId) {
      setData([]);
      return;
    }

    try {
      setIsLoading(true);
      const coursesData = await getAllCourseSchoolYears(schoolYearId, grade);
      setData(coursesData || []);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      setError(error);
      
      if (error instanceof BackendError) {
        store.dispatch(setErrorMessage(error.getMessage()));
      } else {
        store.dispatch(setErrorMessage('Error al cargar cursos'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [schoolYearId, grade]);

  // Cargar datos cuando cambien las dependencias
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { 
    data, 
    isLoading, 
    error,
    refetch: fetchCourses 
  };
};

export default useGetCoursesSchoolYear; 