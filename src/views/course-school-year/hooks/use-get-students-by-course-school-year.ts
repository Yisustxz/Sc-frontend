import { useState, useEffect, useCallback } from 'react';
import { setErrorMessage } from 'store/customizationSlice';
import store from 'store';
import BackendError from 'exceptions/backend-error';
import { StudentOfCourse } from 'core/evaluations/types';
import getStudentsByCourseSchoolYear from 'services/course-school-year/get-students-by-course-school-year';

/**
 * Hook para obtener estudiantes por curso-año escolar
 * @param courseSchoolYearId ID del curso-año escolar
 * @returns Los datos de estudiantes, estado de carga, error y función para recargar datos
 */
const useGetStudentsByCourseSchoolYear = (courseSchoolYearId?: number | null) => {
  const [data, setData] = useState<StudentOfCourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar los datos
  const fetchStudents = useCallback(async () => {
    // Si no hay un curso-año escolar seleccionado, no hacemos petición
    if (!courseSchoolYearId) {
      setData([]);
      return;
    }

    try {
      setIsLoading(true);
      const studentsData = await getStudentsByCourseSchoolYear(courseSchoolYearId);
      setData(studentsData || []);
    } catch (error: any) {
      console.error('Error fetching students:', error);
      setError(error);
      
      if (error instanceof BackendError) {
        store.dispatch(setErrorMessage(error.getMessage()));
      } else {
        store.dispatch(setErrorMessage('Error al cargar estudiantes'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [courseSchoolYearId]);

  // Cargar datos cuando cambien las dependencias
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { 
    data, 
    isLoading, 
    error,
    refetch: fetchStudents 
  };
};

export default useGetStudentsByCourseSchoolYear; 