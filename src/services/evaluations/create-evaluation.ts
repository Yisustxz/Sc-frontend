import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Evaluation, EvaluationDto } from 'core/evaluations/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

// URL del endpoint
const URL = `${API_BASE_URL}/evaluations`;

/**
 * Crea una nueva evaluación
 * @param evaluationData Datos de la evaluación a crear
 * @returns La evaluación creada con su ID
 */
export default async function createEvaluation(
  evaluationData: EvaluationDto
): Promise<Evaluation> {
  try {
    if (!evaluationData.courseSchoolYearId) {
      throw new Error('El ID del curso-año escolar es requerido');
    }
    
    if (!evaluationData.schoolCourtId) {
      throw new Error('El ID del corte escolar es requerido');
    }
    
    console.log('Create evaluation request URL:', URL);
    console.log('Evaluation data:', evaluationData);
    
    const response = await axios.post<Evaluation>(
      URL, 
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
    console.error('Error creating evaluation:', error);
    throw new BackendError(error);
  }
} 