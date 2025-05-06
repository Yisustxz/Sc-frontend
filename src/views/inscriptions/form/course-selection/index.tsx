import { FunctionComponent, useMemo, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { CourseSelectionProps, CourseType } from './types';
import AvailableCoursesPanel from './AvailableCoursesPanel';
import SelectedCoursesPanel from './SelectedCoursesPanel';

/**
 * Componente principal para la selección de cursos en el formulario de inscripción
 * 
 * Este componente gestiona la visualización de cursos disponibles y seleccionados,
 * permitiendo la interacción del usuario para añadir o quitar cursos.
 */
const CourseSelectionPanel: FunctionComponent<CourseSelectionProps> = ({
  selectedSchoolYear,
  selectedGrade,
  selectedCoursesSchoolYear,
  setSelectedCoursesSchoolYear,
  setFieldValue,
  coursesByGrade,
  loadingCoursesSchoolYear
}) => {
  // Generar cursos no seleccionados agrupados por grado
  const coursesByGradeUnselected = useMemo(() => {
    const unselectedMap: Record<string, CourseType[]> = {};
    
    // Recorrer todas las materias agrupadas por grado
    Object.entries(coursesByGrade).forEach(([grade, courses]) => {
      // Filtrar solo los cursos que NO están seleccionados
      const unselectedCourses = courses.filter(
        (course: CourseType) => !selectedCoursesSchoolYear.includes(course.id)
      );
      
      // Solo agregar el grado si hay cursos no seleccionados
      if (unselectedCourses.length > 0) {
        unselectedMap[grade] = unselectedCourses;
      }
    });
    
    return unselectedMap;
  }, [coursesByGrade, selectedCoursesSchoolYear]);

  // Generar cursos seleccionados agrupados por grado
  const coursesByGradeSelected = useMemo(() => {
    const selectedMap: Record<string, CourseType[]> = {};
    
    // Recorrer todas las materias agrupadas por grado
    Object.entries(coursesByGrade).forEach(([grade, courses]) => {
      // Filtrar solo los cursos que están seleccionados
      const selectedCourses = courses.filter(
        (course: CourseType) => selectedCoursesSchoolYear.includes(course.id)
      );
      
      // Solo agregar el grado si hay cursos seleccionados
      if (selectedCourses.length > 0) {
        selectedMap[grade] = selectedCourses;
      }
    });
    
    return selectedMap;
  }, [coursesByGrade, selectedCoursesSchoolYear]);

  // Manejar selección de todos los cursos de un grado
  const handleSelectAllGradeCourses = useCallback((grade: number, isSelected: boolean) => {
    // Obtener todos los cursos del grado especificado
    const coursesInGrade = coursesByGrade[grade] || [];
    const courseIdsInGrade = coursesInGrade.map((course: CourseType) => course.id);
    
    let newSelectedCourses: number[] = [];
    
    if (isSelected) {
      // Añadir todos los cursos del grado (evitando duplicados con Set)
      const coursesSet = new Set([...selectedCoursesSchoolYear, ...courseIdsInGrade]);
      newSelectedCourses = Array.from(coursesSet);
    } else {
      // Eliminar todos los cursos del grado
      newSelectedCourses = selectedCoursesSchoolYear.filter(id => !courseIdsInGrade.includes(id));
    }
    
    // Actualizar el estado de cursos seleccionados
    setSelectedCoursesSchoolYear(newSelectedCourses);
    
    // Crear array de objetos para el campo courseInscriptions
    const courseInscriptions = newSelectedCourses.map(id => ({ courseSchoolYearId: id }));
    setFieldValue('courseInscriptions', courseInscriptions);
  }, [coursesByGrade, selectedCoursesSchoolYear, setSelectedCoursesSchoolYear, setFieldValue]);

  // Manejar selección individual de cursos
  const handleCourseChange = useCallback((courseId: number, isSelected: boolean) => {
    let newSelectedCourses: number[] = [];
    
    if (isSelected) {
      // Añadir curso si no está ya seleccionado
      newSelectedCourses = [...selectedCoursesSchoolYear, courseId];
    } else {
      // Eliminar curso
      newSelectedCourses = selectedCoursesSchoolYear.filter(id => id !== courseId);
    }
    
    // Actualizar el estado de cursos seleccionados
    setSelectedCoursesSchoolYear(newSelectedCourses);
    
    // Crear array de objetos para el campo courseInscriptions
    const courseInscriptions = newSelectedCourses.map(id => ({ courseSchoolYearId: id }));
    setFieldValue('courseInscriptions', courseInscriptions);
  }, [selectedCoursesSchoolYear, setSelectedCoursesSchoolYear, setFieldValue]);

  // Auto add courses when grade is selected and nothing courses was added
  const automaticAddCoursesFromGrade = useCallback(() => {
    if (selectedSchoolYear && selectedGrade && selectedCoursesSchoolYear.length === 0) {
      handleSelectAllGradeCourses(+selectedGrade, true);
    }
  }, [selectedSchoolYear, selectedCoursesSchoolYear, selectedGrade, handleSelectAllGradeCourses]);

  // Si no hay año escolar seleccionado, mostrar mensaje
  if (!selectedSchoolYear) {
    return (
      <Box className="empty-courses-message">
        <Typography variant="body1" color="textSecondary">
          Selecciona un año escolar para ver los cursos disponibles
        </Typography>
      </Box>
    );
  }

  // Si están cargando los cursos, mostrar mensaje de carga
  if (loadingCoursesSchoolYear) {
    return (
      <Box className="loading-courses">
        <Typography variant="body1" color="textSecondary">
          Cargando cursos...
        </Typography>
      </Box>
    );
  }

  // Si no hay cursos disponibles, mostrar mensaje
  if (Object.keys(coursesByGrade).length === 0) {
    return (
      <Box className="empty-courses-message">
        <Typography variant="body1" color="textSecondary">
          No hay cursos disponibles para este año escolar
        </Typography>
      </Box>
    );
  }

  // Renderizar los paneles de selección de cursos
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <AvailableCoursesPanel 
        coursesByGradeUnselected={coursesByGradeUnselected}
        onSelectAllGradeCourses={handleSelectAllGradeCourses}
        onCourseChange={handleCourseChange}
      />
      <SelectedCoursesPanel 
        selectedGrade={selectedGrade}
        selectedCoursesSchoolYear={selectedCoursesSchoolYear}
        coursesByGradeSelected={coursesByGradeSelected}
        onAutomaticAddCourses={automaticAddCoursesFromGrade}
        onSelectAllGradeCourses={handleSelectAllGradeCourses}
        onCourseChange={handleCourseChange}
      />
    </Box>
  );
};

export default CourseSelectionPanel; 