import axios from 'axios';
import { API_BASE_URL } from 'config/constants';
import BackendError from 'exceptions/backend-error';
import store from 'store';

// Types para la actualización de notas del estudiante
export interface UpdateStudentEvaluationGrade {
  evaluationId: number;
  qualification?: number | null;
  didNotPresent?: boolean;
  qualificationDate?: string | null;
}

export interface UpdateStudentGradesData {
  evaluations: UpdateStudentEvaluationGrade[];
}

export interface UpdateStudentGradesResponse {
  message: string;
  results: {
    created: number;
    updated: number;
    errors: any[];
  };
}

export const updateStudentGrades = async (
  courseSchoolYearId: number,
  studentId: number,
  data: UpdateStudentGradesData
): Promise<UpdateStudentGradesResponse> => {
  try {
    const url = `${API_BASE_URL}/course-school-year/${courseSchoolYearId}/student/${studentId}/grades`;
    const response = await axios.put<UpdateStudentGradesResponse>(url, data, {
      headers: {
        Authorization: `Bearer ${store.getState().auth.token}`,
      }
    });
    return response.data;
  } catch (error: unknown) {
    console.error('Error updating student grades:', error);
    throw new BackendError(error);
  }
};
