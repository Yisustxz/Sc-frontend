import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Evaluation } from 'core/evaluations/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

// URL base del endpoint
const BASE_URL = `${API_BASE_URL}/evaluations`;

/**
 * Obtiene una evaluación específica por su ID
 * @param id ID de la evaluación
 * @returns Datos de la evaluación
 */
export default async function getEvaluationById(id: number): Promise<Evaluation> {
  try {
    if (!id) {
      throw new Error('El ID de la evaluación es requerido');
    }
    
    const url = `${BASE_URL}/${id}`;
    
    console.log('Get evaluation by ID request URL:', url);
    
    const response = await axios.get<Evaluation>(
      url, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching evaluation by ID:', error);
    throw new BackendError(error);
  }
} 