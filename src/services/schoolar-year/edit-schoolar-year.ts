import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { SchoolarYearPayload } from 'core/schoolar-year/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/schoolar-years`;

export default async function editSchoolarYear(id: number , body: SchoolarYearsPayload): Promise<SchoolarYearPayload> {
  try {
    console.log("datos endpoint", body)
    const response = await axios.put<SchoolarYearPayload>(
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

export type SchoolarYearsPayload = Omit<SchoolarYearPayload, 'ci' | 'createdAt'>;
