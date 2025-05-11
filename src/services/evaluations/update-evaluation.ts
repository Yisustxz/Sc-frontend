import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Evaluation, EvaluationDto } from 'core/evaluations/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

// URL base del endpoint
const BASE_URL = `${API_BASE_URL}/evaluations`;

/**
 * Actualiza una evaluación existente
 * @param id ID de la evaluación a actualizar
 * @param evaluationData Datos parciales o completos de la evaluación
 * @returns La evaluación actualizada
 */
export default async function updateEvaluation(
  id: number,
  evaluationData: Partial<EvaluationDto>
): Promise<Evaluation> {
  try {
    if (!id) {
      throw new Error('El ID de la evaluación es requerido');
    }
    
    const url = `${BASE_URL}/${id}`;
    
    console.log('Update evaluation request URL:', url);
    console.log('Evaluation update data:', evaluationData);
    
    const response = await axios.patch<Evaluation>(
      url, 
      evaluationData,
      {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error: unknown) {
    console.error('Error updating evaluation:', error);
    throw new BackendError(error);
  }
} 