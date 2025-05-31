import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { StudentOfCourse } from 'core/evaluations/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

// URL base del endpoint
const BASE_URL = `${API_BASE_URL}/course-school-year`;

/**
 * Obtiene todos los estudiantes inscritos en un curso-año escolar específico
 * @param courseSchoolYearId ID del curso-año escolar
 * @returns Lista de estudiantes con su calificación final
 */
export default async function getStudentsByCourseSchoolYear(
  courseSchoolYearId: number
): Promise<StudentOfCourse[]> {
  try {
    if (!courseSchoolYearId) {
      throw new Error('El ID del curso-año escolar es requerido');
    }
    
    const url = `${BASE_URL}/${courseSchoolYearId}/students`;
    
    console.log('Get students by course-school-year request URL:', url);
    
    const response = await axios.get<StudentOfCourse[]>(
      url, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: unknown) {
    console.error('Error fetching students by course-school-year:', error);
    throw new BackendError(error);
  }
} 