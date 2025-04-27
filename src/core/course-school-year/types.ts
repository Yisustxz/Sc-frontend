import { Order } from 'common/constants/order';

export interface CourseSchoolYear {
  id: number;
  grade: number;
  weeklyHours: number;
  courseId: number;
  schoolYearId: number;
  professorId?: number | null;
  course?: {
    id: number;
    name: string;
  };
  schoolYear?: {
    id: number;
    code: string;
    startDate: string;
    endDate: string;
  };
  professor?: {
    id: number;
    name: string;
    firstName?: string;
    lastName?: string;
  } | null;
}

export interface CourseSchoolYearPayload {
  grade: number;
  weeklyHours?: number;
  courseId: number;
  schoolYearId: number;
  professorId?: number | null;
}

export interface CourseSchoolYearFilters {
  schoolYearId?: number;
  grade?: number;
  professorId?: number;
  searchTerm?: string;
  orderBy?: string;
  order?: Order;
}

export interface CreateCourseSchoolYearPayload {
  grade: number;
  courseId?: number;
  schoolYearId?: number;
  weeklyHours?: number | null;
  professorId?: number | null;
}

export interface UpdateCourseSchoolYearPayload {
  grade: number;
  weeklyHours?: number | null;
  professorId?: number | null;
} 