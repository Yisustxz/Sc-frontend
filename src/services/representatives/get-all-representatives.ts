import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Representatives } from 'core/representatives/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';
import addQueryParams from 'services/add-query-params';

const URL = `${API_BASE_URL}/representative/all`;

// Interfaz para los parámetros de búsqueda específica de representantes
export interface GetAllRepresentativesParams {
  searchTerm?: string;
  forceItemsIds?: number[];
  limit?: number;
}

/**
 * Obtiene todos los representantes con opción de filtrado
 * @param params Parámetros opcionales de filtrado
 * @returns Lista de representantes
 */
export default async function getAllRepresentatives(params?: GetAllRepresentativesParams): Promise<Representatives[]> {
  try {
    let urlWithParams = URL;
    
    if (params) {
      // Convertir los parámetros a un formato compatible con URL
      const queryParams: Record<string, string | number | boolean | null> = {};
      
      if (params.searchTerm !== undefined) {
        queryParams.searchTerm = params.searchTerm;
      }
      
      if (params.limit !== undefined) {
        queryParams.limit = params.limit;
      }
      
      if (params.forceItemsIds !== undefined && params.forceItemsIds.length > 0) {
        // Convierte el array a string para que sea compatible con el tipo QueryParams
        queryParams.forceItemsIds = params.forceItemsIds.join(',');
      }
      
      urlWithParams = addQueryParams(URL, queryParams);
    }

    console.log('Representative request URL:', urlWithParams);

    const response = await axios.get<Representatives[]>(
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
