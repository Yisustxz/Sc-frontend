import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { InscriptionDto, UpdateInscriptionDto } from 'core/inscriptions/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/inscriptions`;

export default async function updateInscription(id: number, body: UpdateInscriptionDto): Promise<InscriptionDto> {
  try {
    const response = await axios.patch<InscriptionDto>(
      `${URL}/${id}`, body, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error(`Error updating inscription with ID ${id}:`, error);
    throw new BackendError(error);
  }
} 