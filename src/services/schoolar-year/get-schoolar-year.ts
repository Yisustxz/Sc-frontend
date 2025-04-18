import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { SchoolarYear } from 'core/schoolar-year/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/schoolar-years`;

export default async function getSchoolarYear(id: number ): Promise<SchoolarYear> {
  try {
    const response = await axios.get<SchoolarYear>(
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
