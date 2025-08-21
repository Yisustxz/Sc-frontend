import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { StudentEvaluationQualification, EvaluationWithStudents } from 'core/evaluations/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

interface GetStudentsByEvaluationResponse {
  evaluation: {
    id: number;
    name: string;
    courseSchoolYearId: number;
    schoolCourtId: number;
    percentage: string;
    type: string;
    correlative: number | null;
    projectedDate: string;
    creationDate: string;
    deletedAt: string | null;
    courseSchoolYear: {
      id: number;
      grade: number;
      weeklyHours: number;
      professorId: number;
      courseId: number;
      schoolYearId: number;
      deletedAt: string | null;
    };
    schoolCourt: {
      id: number;
      courtNumber: number;
      startDate: string;
      endDate: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      schoolLapse?: {
        id: number;
        lapseNumber: number;
        startDate: string;
        endDate: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
      };
    };
  };
  students: StudentEvaluationQualification[];
}

/**
 * Obtiene la lista de estudiantes con sus calificaciones para una evaluación específica
 * @param evaluationId ID de la evaluación
 * @returns Los datos de la evaluación con la lista de estudiantes y sus calificaciones
 */
export const getStudentsByEvaluation = async (evaluationId: number): Promise<EvaluationWithStudents> => {
  try {
    const response = await axios.get<GetStudentsByEvaluationResponse>(
      `${API_BASE_URL}/evaluations/${evaluationId}/students`, 
      {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`
        }
      }
    );

    return {
      evaluation: response.data.evaluation,
      students: response.data.students || []
    };
  } catch (error: any) {
    console.error('Error fetching students by evaluation:', error);
    throw new BackendError(error);
  }
}; 