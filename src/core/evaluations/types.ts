import { PaginatedResponse } from 'services/types';

export interface Evaluation {
  id: number;
  name: string;
  schoolCourtId: number;
  percentage: number; // Porcentaje que vale la evaluación (15%, 25%, etc.)
  type: EvaluationType;
  courseSchoolYearId: number;
  correlative?: number; // Número de orden de la evaluación
  projectedDate?: string; // Fecha proyectada para cuando se realizará la evaluación
  creationDate?: string;
}
 
export enum EvaluationType {
  Task = 'Tarea',
  Exam = 'Examen',
  Project = 'Proyecto',
  Homework = 'Asignación',
  Workshop = 'Taller',
  Practice = 'Práctica',
  LapseExam = 'Examen de Lapso'
}

// Usando PaginatedResponse para la respuesta de evaluaciones
export type EvaluationsResponse = PaginatedResponse<Evaluation>;

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
