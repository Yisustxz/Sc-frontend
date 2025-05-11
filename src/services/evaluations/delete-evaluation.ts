import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import BackendError from 'exceptions/backend-error';
import store from 'store';

// URL base del endpoint
const BASE_URL = `${API_BASE_URL}/evaluations`;

/**
 * Elimina una evaluación por su ID
 * @param id ID de la evaluación a eliminar
 * @returns Respuesta vacía en caso de éxito
 */
export default async function deleteEvaluation(id: number): Promise<void> {
  try {
    if (!id) {
      throw new Error('El ID de la evaluación es requerido');
    }
    
    const url = `${BASE_URL}/${id}`;
    
    console.log('Delete evaluation request URL:', url);
    
    await axios.delete(
      url, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`
        }
      }
    );
    
    // Si no hay error, la operación fue exitosa
  } catch (error: unknown) {
    console.error('Error deleting evaluation:', error);
    throw new BackendError(error);
  }
} 