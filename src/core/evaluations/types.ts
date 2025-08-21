import { PaginatedResponse } from 'services/types';

// Interfaz simple para evaluaciones usada principalmente en course-school-year
export interface Evaluation {
  id: number;
  name: string;
  type: string;
  percentage?: number;
  weight?: number;
  schoolCourtId: number;
  courseSchoolYearId?: number;
  correlative?: number;
  projectedDate?: string;
  creationDate?: string;
}

// Interfaz detallada para la vista principal de evaluaciones
export interface EvaluationDetails {
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
}

export enum EvaluationType {
  TASK = 'tarea',
  EXAM = 'examen',
  PROJECT = 'proyecto',
  HOMEWORK = 'asignación',
  WORKSHOP = 'taller',
  PRACTICE = 'practica',
  LAPSE_EXAM = 'examen-de-Lapso',
}

// Usando PaginatedResponse para la respuesta de evaluaciones
export type EvaluationsResponse = PaginatedResponse<EvaluationDetails>;

// DTO para crear/actualizar una evaluación
export interface EvaluationDto {
  name: string;
  schoolCourtId: number;
  percentage: number;
  type: EvaluationType;
  courseSchoolYearId: number;
  correlative?: number;
  projectedDate?: string;
}

// Tipo para los estudiantes de un curso con sus evaluaciones
export interface StudentOfCourse {
  id: number;
  name: string;
  lastName: string;
  dni: string;
  endQualification?: number | null; // Calificación final del estudiante
  qualifications?: StudentQualification[];
}

// Tipo para la calificación de un estudiante en una evaluación
export interface StudentQualification {
  evaluationId: number;
  score: number;
  qualificationDate?: string;
}

// Tipo para la relación entre evaluación y calificación de estudiante (simplificado)
export interface EvaluationQualification {
  id: number;
  evaluationId: number;
  courseInscriptionId: number;
  qualification: number | null;
  qualificationDate: string | null;
}

// Tipos para calificaciones de estudiantes
export interface StudentEvaluationQualification {
  id: number;
  courseInscriptionId: number;
  name: string;
  lastName: string;
  dni: string;
  qualification: number | null;
  didNotPresent: boolean;
}

export interface EvaluationWithStudents {
  evaluation: EvaluationDetails;
  students: StudentEvaluationQualification[];
}

export interface UpdateQualificationData {
  courseInscriptionId: number;
  qualification: number | null;
  didNotPresent: boolean;
}

export interface BulkUpdateQualificationsData {
  qualifications: UpdateQualificationData[];
}

export interface QualificationUpdateResponse {
  updated?: boolean;
  created?: boolean;
  results?: {
    created: number;
    updated: number;
    failed: number;
  };
}
