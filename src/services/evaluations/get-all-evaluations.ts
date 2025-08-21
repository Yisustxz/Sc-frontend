import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { EvaluationDetails } from 'core/evaluations/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';
import addQueryParams from 'services/add-query-params';

// URL del endpoint de obtener todas las evaluaciones
const URL = `${API_BASE_URL}/evaluations`;

// Interfaz para los parámetros de búsqueda
export interface GetAllEvaluationsParams {
  page?: number;
  perPage?: number;
  searchTerm?: string;
  courseSchoolYearId?: number;
  schoolCourtId?: number;
  [key: string]: any; // Firma de índice para permitir cualquier propiedad adicional
}

// Interfaz para la respuesta paginada
export interface EvaluationsResponse {
  items: EvaluationDetails[];
  paginate: {
    totalItems: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

/**
 * Obtiene todas las evaluaciones con opción de filtrado y paginación
 * @param params Parámetros opcionales de filtrado y paginación
 * @returns Respuesta paginada con lista de evaluaciones
 */
export default async function getAllEvaluations(params?: GetAllEvaluationsParams): Promise<EvaluationsResponse> {
  try {
    // Crear la URL con los parámetros de consulta
    const urlWithParams = params ? addQueryParams(URL, params) : URL;
    
    console.log('Evaluations request URL:', urlWithParams);
    
    const response = await axios.get<EvaluationsResponse>(
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