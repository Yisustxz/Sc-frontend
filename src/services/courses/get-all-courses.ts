import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Course } from 'core/courses/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';
import addQueryParams from 'services/add-query-params';

const URL = `${API_BASE_URL}/courses/all`;

interface GetAllCoursesParams {
  grade?: number;
  name?: string;
}

export default async function getAllCourses(params?: GetAllCoursesParams): Promise<Course[]> {
  try {
    // Preparamos los parámetros de consulta si existen
    const queryParams: Record<string, any> = {};
    
    if (params) {
      // Convertir grade a número si existe
      if (params.grade !== undefined) {
        queryParams.grade = Number(params.grade);
      }
      
      // Añadir el parámetro name si existe
      if (params.name) {
        queryParams.name = params.name;
      }
    }
    
    // Añadir los parámetros a la URL
    const urlWithParams = Object.keys(queryParams).length > 0 
      ? addQueryParams(URL, queryParams) 
      : URL;
    
    console.log('course request url', urlWithParams);
    
    const response = await axios.get<Course[]>(
      urlWithParams, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.log(error);
    throw new BackendError(error);
  }
}