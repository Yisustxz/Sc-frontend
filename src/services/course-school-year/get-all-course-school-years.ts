import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import BackendError from 'exceptions/backend-error';
import addQueryParams from 'services/add-query-params';
import store from 'store';

const URL_ALL = `${API_BASE_URL}/course-school-year/all`;

export interface CourseDto {
  id: number;
  name: string;
}

export interface ProfessorDto {
  id: number;
  name: string;
  lastName?: string;
}

export interface SchoolYearDto {
  id: number;
  code: string;
}

export interface CourseSchoolYearDto {
  id: number;
  grade: number | string;
  weeklyHours?: number;
  courseId: number;
  schoolYearId: number;
  professorId?: number;
  course?: CourseDto;
  schoolYear?: SchoolYearDto;
  professor?: ProfessorDto;
}

export interface GetCourseSchoolYearsParams {
  schoolYearId?: number;
  grade?: string;
}

/**
 * Obtiene todas las asignaturas por año escolar
 * @param params Parámetros de filtrado opcionales
 * @returns Lista de asignaturas por año escolar
 */
export async function getAllCourseSchoolYears(
  schoolYearId?: number, 
  grade?: string
): Promise<CourseSchoolYearDto[]> {
  try {
    // Crear objeto de parámetros como strings para evitar problemas con el backend
    const queryParams: Record<string, string> = {};
    
    if (schoolYearId) {
      // Convertir a string para compatibility con el backend
      queryParams.schoolYearId = schoolYearId.toString();
    }
    
    if (grade) {
      queryParams.grade = grade;
    }
    
    const urlWithParams = addQueryParams(URL_ALL, queryParams);
    console.log('Get all course school years request URL:', urlWithParams);
    
    // Hacer una petición al endpoint principal pero con el parámetro all para obtener todos sin paginación
    const response = await axios.get<CourseSchoolYearDto[]>(
      urlWithParams, {
        params: {
          all: 'true'
        },
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );

    // Si la respuesta ya es un array, devolverlo directamente
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: unknown) {
    console.error('Error fetching all course school years:', error);
    throw new BackendError(error);
  }
}