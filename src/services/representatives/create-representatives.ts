import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Representatives } from 'core/representatives/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/representative`;

export default async function createRepresentative(body: RepresentativePayload): Promise<Representatives> {
  try {
    const response = await axios.post<Representatives>(
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

export type RepresentativePayload = Omit<Representatives, 'dni' | 'createdAt'>;