import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import BackendError from 'exceptions/backend-error';
import store from 'store';
import { UpdateQualificationData, BulkUpdateQualificationsData, QualificationUpdateResponse } from 'core/evaluations/types';

const baseUrl = `${API_BASE_URL}/evaluations`;

// Respuesta al actualizar una calificación individual
interface UpdateQualificationResponse {
  updated: boolean;
  created: boolean;
}

// Respuesta al actualizar calificaciones en masa
interface BulkUpdateQualificationsResponse {
  results: {
    created: number;
    updated: number;
    failed: number;
  };
}

/**
 * Actualiza la calificación de un estudiante en una evaluación específica
 * @param evaluationId ID de la evaluación
 * @param data Datos de la calificación a actualizar
 * @returns True si la actualización fue exitosa
 */
export const updateSingleQualification = async (
  evaluationId: number,
  data: UpdateQualificationData
): Promise<boolean> => {
  try {
    const response = await axios.put<QualificationUpdateResponse>(
      `${API_BASE_URL}/evaluations/${evaluationId}/qualifications`,
      data,
      {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`
        }
      }
    );

    return !!(response.data.updated || response.data.created);
  } catch (error: any) {
    console.error('Error updating qualification:', error);
    throw new BackendError(error);
  }
};

/**
 * Actualiza las calificaciones de múltiples estudiantes en una evaluación específica
 * @param evaluationId ID de la evaluación
 * @param data Datos de las calificaciones a actualizar
 * @returns True si la actualización fue exitosa
 */
export const updateBulkQualifications = async (
  evaluationId: number,
  data: BulkUpdateQualificationsData
): Promise<boolean> => {
  try {
    const response = await axios.put<QualificationUpdateResponse>(
      `${API_BASE_URL}/evaluations/${evaluationId}/students-qualifications`,
      data,
      {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`
        }
      }
    );

    // Si hay resultados, consideramos éxito si al menos se creó o actualizó una calificación
    if (response.data.results) {
      return !!(response.data.results.created > 0 || response.data.results.updated > 0);
    }

    return !!(response.data.updated || response.data.created);
  } catch (error: any) {
    console.error('Error updating bulk qualifications:', error);
    throw new BackendError(error);
  }
}; 