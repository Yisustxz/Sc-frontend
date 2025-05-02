import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { CreateInscriptionDto, InscriptionDto } from 'core/inscriptions/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/inscriptions`;

export default async function createInscription(body: CreateInscriptionDto): Promise<InscriptionDto> {
  try {
    // Validar que todos los campos requeridos estén presentes
    if (!body.studentId || !body.schoolYearId || !body.grade || !body.courseInscriptions) {
      throw new Error('Faltan campos requeridos para crear una inscripción');
    }
    
    const response = await axios.post<InscriptionDto>(
      URL, body, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Error creating inscription:', error);
    throw new BackendError(error);
  }
} 