import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Subject } from 'core/subjects/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/subjects`;

export default async function createSubject(body: SubjectPayload): Promise<Subject> {
  try {
    const response = await axios.post<Subject>(
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

export type SubjectPayload = Omit<Subject, 'id' | 'createdAt'>;
