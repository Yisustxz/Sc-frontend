import axios from 'axios';
import { API_BASE_URL } from 'config/constants';
import BackendError from 'exceptions/backend-error';
import store from 'store';

// Types para la actualización de calificaciones del estudiante
export interface UpdateStudentEvaluationQualification {
  evaluationId: number;
  qualification?: number | null;
  didNotPresent?: boolean;
  qualificationDate?: string | null;
}

export interface UpdateStudentQualificationsData {
  evaluations: UpdateStudentEvaluationQualification[];
}

export interface UpdateStudentQualificationsResponse {
  message: string;
  results: {
    created: number;
    updated: number;
    errors: any[];
  };
}

export const updateStudentQualifications = async (
  courseSchoolYearId: number,
  studentId: number,
  data: UpdateStudentQualificationsData
): Promise<UpdateStudentQualificationsResponse> => {
  try {
    const url = `${API_BASE_URL}/course-school-year/${courseSchoolYearId}/student/${studentId}/qualifications`;
    const response = await axios.put<UpdateStudentQualificationsResponse>(url, data, {
      headers: {
        Authorization: `Bearer ${store.getState().auth.token}`,
      }
    });
    return response.data;
  } catch (error: unknown) {
    console.error('Error updating student qualifications:', error);
    throw new BackendError(error);
  }
};
