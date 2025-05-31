import { CourseSchoolYear } from "core/course-school-year/types";
import { Evaluation, EvaluationType } from "core/evaluations/types";
import { CourtOption } from "views/course-school-year/hooks/use-courts-by-course-schoool-year";

// Props para el modal de evaluaciones
export interface EvaluationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (evaluation: EvaluationFormData) => Promise<void>;
  evaluation?: Partial<Evaluation>;
  courseSchoolYear: CourseSchoolYear;
}

// Props para el formulario de evaluaciones
export interface EvaluationFormProps {
  onSubmit: (values: EvaluationFormData) => Promise<void>;
  initialValues: EvaluationFormData;
  onCancel: () => void;
  isSubmitting?: boolean;
  courtsOptions: CourtOption[];
}

// Datos del formulario de evaluaciones
export interface EvaluationFormData {
  id?: number;
  name: string;
  schoolCourtId: number;
  percentage: number;
  type: EvaluationType;
  courseSchoolYearId: number;
  correlative?: number;
  projectedDate?: string;
} 