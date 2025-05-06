import { CourseSchoolYearDto } from 'core/inscriptions/types';

// Tipo para los cursos
export interface CourseType extends CourseSchoolYearDto {}

// Base props para todas las vistas de selección de cursos
export interface BaseCourseSelectionProps {
  // Callback para seleccionar/deseleccionar todos los cursos de un grado
  onSelectAllGradeCourses: (grade: number, isSelected: boolean) => void;
  
  // Callback para seleccionar/deseleccionar un curso individual
  onCourseChange: (courseId: number, isSelected: boolean) => void;
}

// Props para el panel principal
export interface CourseSelectionProps {
  selectedSchoolYear: number | null;
  selectedGrade: string;
  // El array de cursos seleccionados
  selectedCoursesSchoolYear: number[];
  // Función para actualizar los cursos seleccionados en el formulario
  setSelectedCoursesSchoolYear: (courses: number[]) => void;
  // Función para actualizar el campo en Formik
  setFieldValue: (field: string, value: any) => void;
  // Datos para construir la UI
  coursesByGrade: Record<string, CourseType[]>;
  loadingCoursesSchoolYear: boolean;
}

// Props para el panel de cursos disponibles
export interface AvailableCoursesProps extends BaseCourseSelectionProps {
  coursesByGradeUnselected: Record<string, CourseType[]>;
}

// Props para el panel de cursos seleccionados
export interface SelectedCoursesProps extends BaseCourseSelectionProps {
  selectedGrade: string;
  selectedCoursesSchoolYear: number[];
  coursesByGradeSelected: Record<string, CourseType[]>;
  onAutomaticAddCourses: () => void;
} 