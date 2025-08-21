import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { EvaluationDetails } from 'core/evaluations/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const baseUrl = `${API_BASE_URL}/evaluations`;

/**
 * Obtiene una evaluación por su ID
 * @param evaluationId ID de la evaluación
 * @returns Promise con los datos de la evaluación
 */
const getEvaluationById = async (
  evaluationId: number | string,
): Promise<EvaluationDetails> => {
  try {
    if (!evaluationId) {
      throw new Error('ID de evaluación requerido');
    }

    const response = await axios.get(
      `${baseUrl}/${evaluationId}`,
      {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error(`Error al obtener evaluación ${evaluationId}:`, error);
    throw new BackendError(error);
  }
};

export default getEvaluationById; 