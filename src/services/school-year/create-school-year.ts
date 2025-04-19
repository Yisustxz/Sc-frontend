import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { SchoolYearPayload } from 'core/school-year/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/school-years`;

export default async function createSchoolYear(body: SchoolYearPayload): Promise<SchoolYearPayload> {
  try {
    console.log('createSchoolYear', body);
    const response = await axios.post<SchoolYearPayload>(
        URL, body, {
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

export type SchoolYearsPayload = Omit<SchoolYearPayload, 'code' | 'createdAt'>; 