import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Students } from 'core/students/types';
import BackendError from 'exceptions/backend-error';
import addQueryParams from 'services/add-query-params';
import store from 'store';

const URL = `${API_BASE_URL}/student/all`;

export interface GetAllStudentsParams {
  searchTerm?: string;
  limit?: number;
  forceItemsIds?: number[];
}

export default async function getAllStudents(params?: GetAllStudentsParams): Promise<Students[]> {
  try {
    // Convertimos los parámetros a un formato de consulta URL
    const queryParams: Record<string, string | number | boolean | null> = {};
    
    if (params?.searchTerm) {
      queryParams.search = params.searchTerm;
    }
    
    if (params?.limit) {
      queryParams.limit = params.limit;
    }
    
    if (params?.forceItemsIds && params.forceItemsIds.length > 0) {
      queryParams.ids = params.forceItemsIds.join(',');
    }
    
    const urlWithParams = addQueryParams(URL, queryParams);
    console.log('Student request URL:', urlWithParams);
    
    const response = await axios.get<Students[]>(
      urlWithParams, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching students:', error);
    throw new BackendError(error);
  }
}
