import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Students } from 'core/students/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/api/v1/student`;

export default async function getStudent(): Promise<Students> {
  try {
    const response = await axios.get<Students>(
        URL, {
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
