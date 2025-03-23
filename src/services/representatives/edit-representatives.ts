import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Representatives } from 'core/representatives/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/api/v1/representative`;

export default async function editRepresentative(id: number , body: RepresenativePayload): Promise<Representatives> {
  try {
    const response = await axios.put<Representatives>(
     `${URL}/${id}`,body,
      {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.log("Error en editClient:", error);
    throw new BackendError(error);
  }
}

export type RepresenativePayload = Omit<Representatives, 'ci' | 'createdAt'>;
