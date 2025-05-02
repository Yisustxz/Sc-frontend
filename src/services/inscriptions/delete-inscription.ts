import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/inscriptions`;

export default async function deleteInscription(id: number): Promise<void> {
  try {
    await axios.delete(
      `${URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
  } catch (error: unknown) {
    console.error(`Error deleting inscription with ID ${id}:`, error);
    throw new BackendError(error);
  }
} 