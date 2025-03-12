import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { User } from 'core/users/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/users`;

export default async function getClient(userDni: string): Promise<User> {
  try {
    const response = await axios.get<User>(
        `${URL}/${userDni}`, {
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
