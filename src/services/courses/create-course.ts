import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Course } from 'core/courses/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/courses`;

export default async function createCourse(body: CoursePayload): Promise<Course> {
  try {
    console.log('body',body);
    const response = await axios.post<Course>(
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

export type CoursePayload = Omit<Course, 'id' | 'createdAt'>;
