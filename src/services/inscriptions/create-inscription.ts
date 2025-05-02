import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { CreateInscriptionDto, InscriptionDto } from 'core/inscriptions/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

export default async function createInscription(
  payload: CreateInscriptionDto
): Promise<InscriptionDto> {
  try {
    const response = await axios.post<InscriptionDto>(
      `${API_BASE_URL}/inscriptions`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Error creating inscription:', error);
    throw new BackendError(error);
  }
} 