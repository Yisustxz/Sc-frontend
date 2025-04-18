import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Course } from 'core/courses/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/courses/all`;

export default async function getAllCourses(): Promise<Course[]> {
  try {
    const response = await axios.get<Course[]>(
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