import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { CourseSchoolYear, CreateCourseSchoolYearPayload } from 'core/course-school-year/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/course-school-year`;

export default async function createCourseSchoolYear(payload: CreateCourseSchoolYearPayload): Promise<CourseSchoolYear> {
  try {
    const response = await axios.post<CourseSchoolYear>(
      URL,
      payload,
      {
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