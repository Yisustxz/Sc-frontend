import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { SchoolYearPayload } from 'core/school-year/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/school-years`;

export default async function editSchoolYear(id: number, body: SchoolYearsPayload): Promise<SchoolYearPayload> {
  try {
    console.log("datos endpoint", body)
    const response = await axios.put<SchoolYearPayload>(
     `${URL}/${id}`,body,
      {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.log()
    console.log("Error en Editar Años escolares:", error);
    throw new BackendError(error);
  }
}

export type SchoolYearsPayload = Omit<SchoolYearPayload, 'code' | 'createdAt'>; 