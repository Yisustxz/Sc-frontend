import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { SchoolYear } from 'core/school-year/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/school-years`;

export default async function getSchoolYear(id: number): Promise<SchoolYear> {
  try {
    const response = await axios.get<SchoolYear>(
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