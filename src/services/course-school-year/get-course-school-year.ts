import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { CourseSchoolYear } from 'core/course-school-year/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/course-school-year`;

export default async function getCourseSchoolYear(id: number): Promise<CourseSchoolYear> {
  try {
    const response = await axios.get<CourseSchoolYear>(
      `${URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new BackendError(error);
  }
} 