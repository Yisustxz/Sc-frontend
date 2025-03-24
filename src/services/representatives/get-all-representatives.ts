import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Representatives } from 'core/representatives/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/representative/all`;

export default async function getAllRepresentatives(): Promise<Representatives> {
  try {
    const response = await axios.get<Representatives>(
        URL, {
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