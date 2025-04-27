import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { SchoolYearSelect } from 'core/school-year/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/school-years/all`;

export default async function getAllSchoolYear(searchTerm: string = ''): Promise<SchoolYearSelect[]> {
  try {
    const response = await axios.get<SchoolYearSelect[]>(
        URL, {
        params: { searchTerm },
        headers: { Authorization: `Bearer ${store.getState().auth.token}` }
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.log(error);
    throw new BackendError(error);
  }
}
