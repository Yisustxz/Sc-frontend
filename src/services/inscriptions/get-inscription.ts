import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { InscriptionDto } from 'core/inscriptions/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/inscriptions`;

export default async function getInscription(id: number): Promise<InscriptionDto> {
  try {
    const response = await axios.get<InscriptionDto>(
      `${URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error(`Error fetching inscription with ID ${id}:`, error);
    throw new BackendError(error);
  }
} 