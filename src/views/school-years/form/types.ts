import { FormikHelpers } from 'formik';

export interface SchoolCourtForm {
  courtId?: number;
  startDate: string;
  endDate: string;
  localDeleted?: boolean;
  onlineState?: any;
  isNew?: boolean;
  isDirty?: boolean;
}

export interface SchoolLapseForm {
  lapseId?: number | null;
  startDate: string;
  endDate: string;
  schoolCourts: SchoolCourtForm[];
  isNew?: boolean;
  isDirty?: boolean;
  localDeleted?: boolean;
  onlineState?: any;
}

export interface SchoolCourseForm {
  id?: number;
  courseSchoolYearId?: number; // ID de la relación en la base de datos
  courseId: number;
  grade: number; // Uno de los 11 grados predefinidos
  professorId?: number;
  weeklyHours?: number;
  localDeleted?: boolean;
  isNew?: boolean;
  isDirty?: boolean;
  // Información relacional (solo para UI, no se envía al backend)
  relationsInfo?: {
    courseName?: string;
    professorName?: string;
  };
}

export interface FormValues {
  code: string;
  startDate: string;
  endDate: string;
  lapses: SchoolLapseForm[];
  courseSchoolYears: SchoolCourseForm[];
  submit: string | null;
}

export type OnSubmit = (
  values: FormValues,
  formikHelpers: FormikHelpers<FormValues>
) => void | Promise<any>; 