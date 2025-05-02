import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { InscriptionDto } from 'core/inscriptions/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

export interface GetAllInscriptionsParams {
  searchTerm?: string;
  limit?: number;
  schoolYearId?: number;
  grade?: string;
  forceItemsIds?: number[];
}

export default async function getAllInscriptions(
  params: GetAllInscriptionsParams = {}
): Promise<InscriptionDto[]> {
  try {
    let url = `${API_BASE_URL}/inscriptions/all`;
    
    // Añadir parámetros de consulta si existen
    const queryParams = new URLSearchParams();
    
    if (params.searchTerm) {
      queryParams.append('search', params.searchTerm);
    }
    
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    if (params.schoolYearId) {
      queryParams.append('schoolYearId', params.schoolYearId.toString());
    }
    
    if (params.grade) {
      queryParams.append('grade', params.grade);
    }
    
    if (params.forceItemsIds && params.forceItemsIds.length > 0) {
      params.forceItemsIds.forEach((id) => {
        queryParams.append('ids', id.toString());
      });
    }
    
    // Añadir los parámetros a la URL
    const queryString = queryParams.toString();
    if (queryString) {
      url = `${url}?${queryString}`;
    }
    
    const response = await axios.get<InscriptionDto[]>(url, {
      headers: {
        Authorization: `Bearer ${store.getState().auth.token}`,
      },
    });
    
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching all inscriptions:', error);
    throw new BackendError(error);
  }
} 