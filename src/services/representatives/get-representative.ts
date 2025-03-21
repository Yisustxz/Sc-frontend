import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Representatives } from 'core/representatives/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/api/v1/representante`;

export default async function getRepresentative(id: number ): Promise<Representatives> {
  try {
    const response = await axios.get<Representatives>(
        `${URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.log(error);
    throw new BackendError(error);
  }
}
