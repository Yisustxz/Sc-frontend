import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/course-school-year`;

export default async function deleteCourseSchoolYear(id: number): Promise<void> {
  try {
    await axios.delete(
      `${URL}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
  } catch (error) {
    console.log(error);
    throw new BackendError(error);
  }
} 