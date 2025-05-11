import { SchoolYear, SchoolLapse, SchoolCourt } from 'core/school-year/types';
import { Evaluation } from 'core/evaluations/types';

// Props para el componente principal de evaluaciones
export interface EvaluationsProps {
  schoolYear: SchoolYear;
  evaluations: Evaluation[];
  onAddEvaluation?: (evaluation: Partial<Evaluation>) => void;
  onEditEvaluation?: (id: number, evaluation: Partial<Evaluation>) => void;
  onDeleteEvaluation?: (id: number) => void;
  loading?: boolean;
}

// Props para el acordeón de lapsos
export interface LapsesAccordionProps {
  schoolYear: SchoolYear;
  evaluations: Evaluation[];
  onAddEvaluation?: (evaluation: Partial<Evaluation>) => void;
  onEditEvaluation?: (id: number, evaluation: Partial<Evaluation>) => void;
  onDeleteEvaluation?: (id: number) => void;
}

// Props para un item de lapso
export interface LapseItemProps {
  schoolLapse: SchoolLapse;
  evaluations: Evaluation[];
  lapseIndex: number;
  onAddEvaluation?: (evaluation: Partial<Evaluation>) => void;
  onEditEvaluation?: (id: number, evaluation: Partial<Evaluation>) => void;
  onDeleteEvaluation?: (id: number) => void;
}

// Props para un item de corte
export interface CourtItemProps {
  schoolCourt: SchoolCourt;
  evaluations: Evaluation[];
  lapseIndex: number;
  courtIndex: number;
  onAddEvaluation?: (evaluation: Partial<Evaluation>) => void;
  onEditEvaluation?: (id: number, evaluation: Partial<Evaluation>) => void;
  onDeleteEvaluation?: (id: number) => void;
}

// Props para la lista de evaluaciones
export interface EvaluationListProps {
  evaluations: Evaluation[];
  onEditEvaluation?: (id: number, evaluation: Partial<Evaluation>) => void;
  onDeleteEvaluation?: (id: number) => void;
}
