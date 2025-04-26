import { useState, useEffect, useCallback } from "react";
import { SchoolCourseForm } from "../types";

interface UseLocalCoursesProps {
  courses: SchoolCourseForm[];
  onChange: (courses: SchoolCourseForm[]) => void;
}

/*function deepCompare(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}*/

/**
 * Hook para gestionar el estado local de los cursos por año escolar y sus operaciones CRUD
 */
const useLocalCourses = ({ courses, onChange }: UseLocalCoursesProps) => {
  // Estado local
  const [localCourses, setLocalCourses] = useState<SchoolCourseForm[]>(
    courses || []
  );

  // Actualizar cuando cambian las props
  useEffect(() => {
    // Si recibimos nuevos cursos del padre, actualizamos el estado local
    // pero debemos preservar los metadatos como isNew, isDirty, localDeleted
    if (courses && courses !== localCourses/* && !deepCompare(courses, localCourses)*/) {
      const newLocalCourses = courses.map(newCourse => {
        // Buscar el curso correspondiente en nuestro estado local
        const existingCourse = localCourses.find(localCourse => 
          (localCourse.id && localCourse.id === newCourse.id) || 
          (localCourse.courseId === newCourse.courseId && localCourse.grade === newCourse.grade)
        );
        
        if (existingCourse) {
          // Si existe, preservamos los metadatos
          return {
            ...newCourse,
            isNew: existingCourse.isNew || false,
            isDirty: existingCourse.isDirty || false,
            localDeleted: existingCourse.localDeleted || false,
            // Preservamos la información relacional o la actualizamos si viene nueva
            relationsInfo: {
              courseName: newCourse.relationsInfo?.courseName || existingCourse.relationsInfo?.courseName || "",
              professorName: newCourse.relationsInfo?.professorName || existingCourse.relationsInfo?.professorName || "",
            }
          };
        }
        
        // Si es un curso completamente nuevo
        return {
          ...newCourse,
          relationsInfo: newCourse.relationsInfo || {
            courseName: "",
            professorName: ""
          }
        };
      });
      
      //if (!deepCompare(newLocalCourses, localCourses)) {
        console.log("<<<<<<<<<<<<< HUBO UNA ACTAULIZACION DEEEP DE CURSOS >>>>>>>>><<");
        setLocalCourses(newLocalCourses);
      //}
    }
  }, [courses, localCourses]);

  // Obtener cursos filtrados por grado
  const getCoursesByGrade = useCallback(
    (grade: number) => {
      console.log("Buscando cursos para grado:", grade);
      
      // Filtrar cursos para el grado especificado
      const filteredCourses = localCourses.filter((course) => {
        return course.grade === grade;
      });

      return filteredCourses;
    },
    [localCourses]
  );

  // Crear nuevo curso
  const onCreate = useCallback(
    (course: SchoolCourseForm) => {
      const newCourse: SchoolCourseForm = {
        ...course,
        grade: Number(course.grade),
        courseId: Number(course.courseId),
        professorId: course.professorId ? Number(course.professorId) : undefined,
        weeklyHours: course.weeklyHours ? Number(course.weeklyHours) : 0,
        isNew: true,
        isDirty: false,
        localDeleted: false,
      };

      const updatedCourses = [...localCourses, newCourse];
      setLocalCourses(updatedCourses);
      onChange(updatedCourses);
    },
    [localCourses, onChange]
  );

  // Actualizar curso existente
  const onUpdate = useCallback(
    (index: number, updatedData: Partial<SchoolCourseForm>) => {
      const updatedCourses = [...localCourses];
      const existingCourse = updatedCourses[index];
      
      if (!existingCourse) {
        console.error("Curso no encontrado en el índice:", index);
        return;
      }

      // Asegurar que los campos numéricos sean números
      const processedData = {
        ...updatedData,
        grade: updatedData.grade !== undefined ? Number(updatedData.grade) : existingCourse.grade,
        courseId: updatedData.courseId !== undefined ? Number(updatedData.courseId) : existingCourse.courseId,
        professorId: updatedData.professorId ? Number(updatedData.professorId) : existingCourse.professorId,
        weeklyHours: updatedData.weeklyHours ? Number(updatedData.weeklyHours) : existingCourse.weeklyHours
      };

      updatedCourses[index] = {
        ...existingCourse,
        ...processedData,
        isDirty: existingCourse.isNew ? false : true,
      };

      setLocalCourses(updatedCourses);
      onChange(updatedCourses);
    },
    [localCourses, onChange]
  );

  // Marcar un curso como eliminado
  const onDelete = useCallback(
    (index: number) => {
      const updatedCourses = [...localCourses];
      const course = updatedCourses[index];
      
      if (!course) {
        console.error("Curso no encontrado en el índice:", index);
        return;
      }

      if (course.isNew) {
        // Si es nuevo, lo eliminamos directamente
        updatedCourses.splice(index, 1);
      } else {
        // Si ya existe, lo marcamos como eliminado
        updatedCourses[index] = {
          ...course,
          localDeleted: true,
        };
      }

      setLocalCourses(updatedCourses);
      onChange(updatedCourses);
    },
    [localCourses, onChange]
  );

  // Revertir eliminación
  const onRevertDelete = useCallback(
    (index: number) => {
      const updatedCourses = [...localCourses];
      const course = updatedCourses[index];
      
      if (!course) {
        console.error("Curso no encontrado en el índice:", index);
        return;
      }
      
      updatedCourses[index] = {
        ...updatedCourses[index],
        localDeleted: false,
      };

      setLocalCourses(updatedCourses);
      onChange(updatedCourses);
    },
    [localCourses, onChange]
  );

  return {
    localCourses,
    getCoursesByGrade,
    onCreate,
    onUpdate,
    onDelete,
    onRevertDelete,
  };
};

export default useLocalCourses; 