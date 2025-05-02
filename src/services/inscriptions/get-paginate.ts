import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { InscriptionDto, PaginateInscriptionDto } from 'core/inscriptions/types';
import BackendError from 'exceptions/backend-error';
import addQueryParams from 'services/add-query-params';
import { PaginatedResponse } from 'services/types';
import store from 'store';

const URL = `${API_BASE_URL}/inscriptions`;

export default async function getPaginate(params: PaginateInscriptionDto): Promise<InscriptionsPaginated> {
  try {
    // Convertimos los parámetros a un Record<string, string | number | boolean | null>
    const queryParams: Record<string, string | number | boolean | null> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        // Solo asignar si value no es un objeto vacío
        if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) {
          // Ignorar objetos vacíos
        } else {
          queryParams[key] = value;
        }
      }
    });
    
    const urlPaginated = addQueryParams(URL, queryParams);
    const response = await axios.get<InscriptionsPaginated>(
      urlPaginated, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching paginated inscriptions:', error);
    throw new BackendError(error);
  }
}

export type InscriptionsPaginated = PaginatedResponse<InscriptionDto>;
