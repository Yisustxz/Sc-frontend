import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { CourseSchoolYear } from 'core/school-year/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/school-years`;

/**
 * Obtiene todas las asignaturas asignadas a un año escolar, filtradas por grado
 * @param schoolYearId ID del año escolar
 * @param grade Grado a filtrar (opcional)
 * @returns Lista de asignaturas filtradas por grado
 */
export default async function getAllCourseSchoolYearByGrade(
  schoolYearId: number,
  grade?: string
): Promise<CourseSchoolYear[]> {
  try {
    let endpoint = `${URL}/${schoolYearId}/courses`;
    
    // Si se proporciona un grado, añadirlo como parámetro de consulta
    if (grade) {
      endpoint += `?grade=${encodeURIComponent(grade)}`;
    }
    
    const response = await axios.get<CourseSchoolYear[]>(endpoint, {
      headers: {
        Authorization: `Bearer ${store.getState().auth.token}`,
      }
    });
    
    return response.data;
  } catch (error: unknown) {
    console.error('Error al obtener las asignaturas por grado:', error);
    throw new BackendError(error);
  }
} 