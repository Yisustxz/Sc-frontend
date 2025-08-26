import axios from 'axios';
import { API_BASE_URL } from 'config/constants';
import BackendError from 'exceptions/backend-error';
import store from 'store';

// Types para la respuesta de calificaciones del estudiante
export interface StudentEvaluationQualification {
  evaluationId: number;
  evaluationName: string;
  evaluationType: string;
  percentage: number;
  correlative?: number;
  projectedDate?: string | null;
  qualification: number | null;
  qualificationDate: string | null;
  didNotPresent: boolean;
  schoolCourt: {
    id: number;
    lapseNumber: number;
    lapseName: string;
  };
}

export interface StudentQualificationsDetailResponse {
  studentId: number;
  studentName: string;
  studentLastName: string;
  studentDni: string;
  finalGrade: number | null;
  course: {
    id: number;
    name: string;
    grade: string;
  };
  schoolYear: {
    id: number;
    code: string;
  };
  evaluations: StudentEvaluationQualification[];
}

export const getStudentQualificationsDetail = async (
  courseSchoolYearId: number,
  studentId: number
): Promise<StudentQualificationsDetailResponse> => {
  try {
    const url = `${API_BASE_URL}/course-school-year/${courseSchoolYearId}/student/${studentId}/qualifications`;
    const response = await axios.get<StudentQualificationsDetailResponse>(url, {
      headers: {
        Authorization: `Bearer ${store.getState().auth.token}`,
      }
    });
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching student qualifications detail:', error);
    throw new BackendError(error);
  }
};
