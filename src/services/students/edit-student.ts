import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Students } from 'core/students/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/api/v1/estudiante`;

export default async function editClient(id: number , body: StudentPayload): Promise<Students> {
  try {
    const finalURL = `${URL}/${id}`;
    console.log("URL generada:", finalURL); 
    console.log("Payload enviado:", body); 
    const response = await axios.put<Students>(
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

export type StudentPayload = Omit<Students, 'ci' | 'createdAt'>;
