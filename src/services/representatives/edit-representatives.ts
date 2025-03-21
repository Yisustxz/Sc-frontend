import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Representatives } from 'core/representatives/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/api/v1/representante`;

export default async function editRepresentative(id: number , body: RepresenativePayload): Promise<Representatives> {
  try {
    const finalURL = `${URL}/${id}`;
    console.log("URL generada:", finalURL);
    console.log("Payload enviado:", body); 
    const response = await axios.put<Representatives>(
      finalURL,
      body,
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
