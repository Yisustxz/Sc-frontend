import { Evaluation, EvaluationType } from "core/evaluations/types";

// Props para el modal de evaluaciones
export interface EvaluationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (evaluation: EvaluationFormData) => void;
  evaluation?: Partial<Evaluation>;
  schoolCourtId?: number;
  courseSchoolYearId: number;
}

// Props para el formulario de evaluaciones
export interface EvaluationFormProps {
  onSubmit: (values: EvaluationFormData) => void;
  initialValues: EvaluationFormData;
  onCancel: () => void;
  isSubmitting?: boolean;
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