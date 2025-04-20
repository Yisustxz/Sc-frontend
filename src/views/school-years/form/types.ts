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

export interface FormValues {
  code: string;
  startDate: string;
  endDate: string;
  lapses: SchoolLapseForm[];
  submit: string | null;
}

export type OnSubmit = (
  values: FormValues,
  formikHelpers: FormikHelpers<FormValues>
) => void | Promise<any>; 