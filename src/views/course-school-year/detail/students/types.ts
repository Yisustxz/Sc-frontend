import { StudentOfCourse } from 'core/evaluations/types';

export interface StudentsProps {
  courseSchoolYearId: number;
  students: StudentOfCourse[];
  loading?: boolean;
  onViewStudentDetails?: (studentId: number) => void;
}

export interface StudentsTableProps {
  students: StudentOfCourse[];
  loading: boolean;
  onViewStudentDetails?: (studentId: number) => void;
  page: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
} 