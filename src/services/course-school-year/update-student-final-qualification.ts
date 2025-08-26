import axios from 'axios';
import { API_BASE_URL } from 'config/constants';
import BackendError from 'exceptions/backend-error';
import store from 'store';

// Types para la actualización de la calificación final
export interface UpdateStudentFinalQualificationData {
  finalQualification?: number | null;
}

export interface UpdateStudentFinalQualificationResponse {
  message: string;
}

export const updateStudentFinalQualification = async (
  courseSchoolYearId: number,
  studentId: number,
  data: UpdateStudentFinalQualificationData
): Promise<UpdateStudentFinalQualificationResponse> => {
  try {
    const url = `${API_BASE_URL}/course-school-year/${courseSchoolYearId}/student/${studentId}/final-qualification`;
    const response = await axios.put<UpdateStudentFinalQualificationResponse>(url, data, {
      headers: {
        Authorization: `Bearer ${store.getState().auth.token}`,
      }
    });
    return response.data;
  } catch (error: unknown) {
    console.error('Error updating student final qualification:', error);
    throw new BackendError(error);
  }
};
