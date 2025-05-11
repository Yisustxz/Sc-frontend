import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Evaluation } from 'core/evaluations/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

// URL base del endpoint
const BASE_URL = `${API_BASE_URL}/evaluations/by-course-school-year`;

/**
 * Obtiene todas las evaluaciones asociadas a un curso-año escolar específico
 * @param courseSchoolYearId ID del curso-año escolar
 * @returns Lista de evaluaciones
 */
export default async function getEvaluationsByCourseSchoolYear(
  courseSchoolYearId: number
): Promise<Evaluation[]> {
  try {
    if (!courseSchoolYearId) {
      throw new Error('El ID del curso-año escolar es requerido');
    }
    
    const url = `${BASE_URL}/${courseSchoolYearId}`;
    
    console.log('Get evaluations by course-school-year request URL:', url);
    
    const response = await axios.get<Evaluation[]>(
      url, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: unknown) {
    console.error('Error fetching evaluations by course-school-year:', error);
    throw new BackendError(error);
  }
} 