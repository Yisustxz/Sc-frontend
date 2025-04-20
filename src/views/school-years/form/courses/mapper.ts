import { SchoolCourseForm } from "../types";

// Definición de cómo viene un curso del backend
interface BackendCourseSchoolYear {
  id: number;
  grade: number;
  weeklyHours: number;
  professorId: number | null;
  courseId: number;
  course?: {
    id: number;
    name: string;
  };
  professor?: {
    id: number;
    name: string;
  };
}

// Definición de cómo enviamos un curso al backend
export interface BackendCourseSchoolYearRequest {
  id?: number;  // Opcional para nuevos cursos
  grade: number;
  weeklyHours: number;
  professorId: number | null;
  courseId: number;
}

/**
 * Transforma los datos de cursos del formato del backend al formato del frontend
 */
export const mapBackendCoursesToFrontend = (backendCourses: BackendCourseSchoolYear[]): SchoolCourseForm[] => {
  if (!backendCourses || !backendCourses.length) return [];
  
  console.log("Transformando cursos del backend:", backendCourses);
  
  const result = backendCourses.map(course => {
    // Asegurarnos de que todos los campos numéricos sean números
    const transformedCourse: SchoolCourseForm = {
      id: Number(course.id),
      grade: Number(course.grade),
      weeklyHours: course.weeklyHours || 0,
      professorId: course.professorId !== null ? Number(course.professorId) : undefined,
      courseId: Number(course.courseId),
      // Información relacional para UI
      relationsInfo: {
        courseName: course.course?.name || "",
        professorName: course.professor?.name || "",
      }
    };
    
    console.log("Curso transformado:", transformedCourse);
    return transformedCourse;
  });
  
  console.log("Resultado final de la transformación:", result);
  return result;
};

/**
 * Transforma los datos de cursos del formato del frontend al formato del backend
 */
export const mapFrontendCoursesToBackend = (frontendCourses: SchoolCourseForm[]): BackendCourseSchoolYearRequest[] => {
  if (!frontendCourses || !frontendCourses.length) return [];
  
  return frontendCourses
    .filter(course => !course.localDeleted) // No enviamos los marcados como eliminados
    .map(course => {
      // Convertir los datos al formato que espera el backend
      const result: BackendCourseSchoolYearRequest = {
        courseId: Number(course.courseId) || 0, // Aseguramos que nunca sea undefined
        grade: Number(course.grade) || 0, // Aseguramos que nunca sea undefined
        weeklyHours: course.weeklyHours || 0, // Aseguramos que nunca sea undefined
        professorId: course.professorId ? Number(course.professorId) : null, // Aseguramos que nunca sea undefined
      };
      
      // Solo incluir el ID si no es un curso nuevo
      if (course.id && !course.isNew) {
        result.id = Number(course.id);
      }
      
      return result;
    });
};

/**
 * Obtiene los IDs de los cursos que deben eliminarse
 */
export const getCoursesToDelete = (frontendCourses: SchoolCourseForm[]): number[] => {
  return frontendCourses
    .filter(course => course.localDeleted && !course.isNew && course.id)
    .map(course => Number(course.id));
}; 