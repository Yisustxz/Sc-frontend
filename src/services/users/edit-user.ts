import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { User } from 'core/users/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/users`;

export default async function editUser(id: string, body: UserPayload): Promise<User> {
  try {
    const response = await axios.put<User>(
        `${URL}/${id}`, body, {
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

export type UserPayload = Omit<User, 'id' | 'createdAt'>;
