import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/courses`;

export default async function deleteCourse(id: string | number): Promise<void> {
  try {
    const idStr = typeof id === 'number' ? id.toString() : id;
    await axios.delete(
        `${URL}/${idStr}`, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
  } catch (error: unknown) {
    throw new BackendError(error);
  }
}
