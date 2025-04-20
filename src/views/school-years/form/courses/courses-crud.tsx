import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Button,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Tooltip,
  Chip,
  Stack,
} from "@mui/material";
import { IconCirclePlus, IconEdit, IconTrash, IconArrowBackUp, IconWand } from "@tabler/icons";
import { SchoolCourseForm } from "../types";
import useLocalCourses from "./use-local-courses";
import CourseModal from "./course-modal";
import { FormikErrors } from "formik";
import styled from "styled-components";
import { EducationLevels, gradeMapping } from "core/courses/use-education-levels";
import getAllCourses from "services/courses/get-all-courses";
import { useAppDispatch } from "store";
import { setErrorMessage, setIsLoading, setSuccessMessage } from "store/customizationSlice";
import BackendError from "exceptions/backend-error";

interface CoursesCrudProps {
  courses: SchoolCourseForm[];
  onChange: (courses: SchoolCourseForm[]) => void;
  errors?: FormikErrors<{ courseSchoolYears: SchoolCourseForm[] }>;
  className?: string;
  cardTitle?: React.ReactNode;
  // Propiedades para el control externo del modal
  externalModalOpen?: boolean;
  onExternalModalClose?: () => void;
  onExternalModalOpen?: () => void;
  // Nueva propiedad para determinar si es una operación de CREAR o EDITAR
  isCreateMode?: boolean;
}

const CoursesCrud = ({ 
  courses, 
  onChange, 
  errors, 
  className, 
  cardTitle,
  externalModalOpen,
  onExternalModalClose,
  onExternalModalOpen,
  isCreateMode = false
}: CoursesCrudProps) => {
  // Inicialización de estados con detección de primer grado con cursos
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const dispatch = useAppDispatch();

  // Detectar el primer grado con cursos o por defecto usar 1
  useEffect(() => {
    if (courses && courses.length > 0) {
      console.log("Detectando grados con cursos...");
      // Intenta encontrar los grados únicos que tienen cursos
      const uniqueGrades = Array.from(new Set(courses.map(course => course.grade)));
      console.log("Grados únicos encontrados:", uniqueGrades);
      
      if (uniqueGrades.length > 0) {
        // Ordenar los grados para seleccionar el menor
        const sortedGrades = [...uniqueGrades].sort((a, b) => a - b);
        const firstGrade = sortedGrades[0];
        console.log("Primer grado encontrado:", firstGrade);
        
        // Actualizar tanto el grado actual como el índice de la pestaña
        setCurrentGrade(firstGrade);
        const tabIndex = Math.max(0, firstGrade - 1);
        setTabValue(tabIndex);
      }
    }
  }, [courses]); // Solo se ejecuta cuando cambian los cursos

  const [currentGrade, setCurrentGrade] = useState<number>(1);
  const [editingCourse, setEditingCourse] = useState<SchoolCourseForm | undefined>();
  const [tabValue, setTabValue] = useState(0);

  // Determinar si el modal está controlado externamente
  const isExternallyControlled = externalModalOpen !== undefined && onExternalModalClose !== undefined;
  
  // Estado efectivo del modal
  const modalOpen = isExternallyControlled ? externalModalOpen : internalModalOpen;
  
  // Función para cerrar el modal, respetando el tipo de control
  const closeModal = () => {
    if (isExternallyControlled) {
      onExternalModalClose?.();
    } else {
      setInternalModalOpen(false);
    }
  };

  // Hook para gestionar el estado local de los cursos
  const { 
    localCourses, 
    getCoursesByGrade, 
    onCreate, 
    onUpdate, 
    onDelete, 
    onRevertDelete 
  } = useLocalCourses({
    courses,
    onChange,
  });

  // Log para depurar los cursos recibidos
  console.log("CoursesCrud - Cursos recibidos:", courses);
  console.log("CoursesCrud - Estado inicial localCourses:", localCourses);

  // Añadir un useEffect para detectar cambios en la lista de cursos
  useEffect(() => {
    console.log("CoursesCrud - Cursos actualizados:", courses);
    console.log("CoursesCrud - localCourses actualizado:", localCourses);
  }, [courses, localCourses]);

  // Todos los grados disponibles (1-11)
  const allGrades = useMemo(() => 
    Array.from({ length: 11 }, (_, i) => i + 1), 
  []);

  // Función para abrir el modal de creación
  const handleAddCourse = () => {
    setEditingCourse(undefined);
    
    if (isExternallyControlled) {
      onExternalModalOpen?.();
    } else {
      setInternalModalOpen(true);
    }
  };

  // Función para rellenar automáticamente todas las asignaturas
  const handleAutoFill = useCallback(async () => {
    try {
      setIsLoadingCourses(true);
      dispatch(setIsLoading(true));
      
      // Obtenemos todas las asignaturas desde el backend
      const allCourses = await getAllCourses();
      
      if (!allCourses || allCourses.length === 0) {
        dispatch(setErrorMessage("No hay asignaturas disponibles para rellenar automáticamente"));
        return;
      }
      
      console.log("Asignaturas obtenidas para rellenar automáticamente:", allCourses);
      
      // Crear nuevos SchoolCourseForm para cada asignatura
      const newCourses: SchoolCourseForm[] = allCourses.map(course => ({
        courseId: course.id,
        grade: course.grade,
        weeklyHours: 0, // Iniciar con 0 horas semanales
        professorId: undefined, // Sin profesor asignado
        isNew: true,
        relationsInfo: {
          courseName: course.name
        }
      }));
      
      // Actualizar los cursos
      onChange(newCourses);
      
      dispatch(setSuccessMessage(`Se han añadido ${newCourses.length} asignaturas automáticamente`));
    } catch (error) {
      if (error instanceof BackendError) {
        dispatch(setErrorMessage(error.getMessage()));
      } else {
        dispatch(setErrorMessage("Error al rellenar automáticamente las asignaturas"));
      }
      console.error("Error al rellenar automáticamente las asignaturas:", error);
    } finally {
      setIsLoadingCourses(false);
      dispatch(setIsLoading(false));
    }
  }, [onChange, dispatch]);

  // Crear una referencia al botón que se puede activar externamente
  const addCourseRef = React.useRef<HTMLButtonElement>(null);
  
  // Para mantener compatibilidad con el código existente, seguimos exponiendo el método
  // pero sólo si no está controlado externamente
  useEffect(() => {
    if (!isExternallyControlled && typeof window !== 'undefined') {
      (window as any).openCourseModal = handleAddCourse;
      
      return () => {
        delete (window as any).openCourseModal;
      };
    }
  }, [isExternallyControlled]);

  // Función para abrir el modal de edición
  const handleEditCourse = (course: SchoolCourseForm) => {
    console.log("Editando curso:", course);
    // Nos aseguramos de que el curso tenga todos los datos necesarios
    const courseToEdit = {
      ...course,
      // Nos aseguramos de que todos los campos numéricos sean números
      grade: Number(course.grade),
      courseId: Number(course.courseId),
      professorId: course.professorId ? Number(course.professorId) : undefined,
      weeklyHours: course.weeklyHours ? Number(course.weeklyHours) : 0
    };
    
    setEditingCourse(courseToEdit);
    
    if (isExternallyControlled) {
      onExternalModalOpen?.();
    } else {
      setInternalModalOpen(true);
    }
  };

  // Función para guardar un curso (nuevo o editado)
  const handleSaveCourse = (course: SchoolCourseForm) => {
    if (editingCourse) {
      // Encontrar el índice del curso que estamos editando
      const index = localCourses.findIndex(c => 
        c === editingCourse || 
        (c.id && c.id === editingCourse.id) ||
        (c.courseSchoolYearId && c.courseSchoolYearId === editingCourse.courseSchoolYearId)
      );
      
      if (index !== -1) {
        onUpdate(index, course);
      }
    } else {
      onCreate(course);
    }
    
    closeModal();
  };

  // Cambiar de pestaña (grado)
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const newGrade = newValue + 1;
    setCurrentGrade(newGrade);
    console.log("CoursesCrud - Cambio a grado:", newGrade);
  };

  // Obtener cursos para el grado actual
  const currentCourses = getCoursesByGrade(currentGrade);
  console.log("CoursesCrud - Cursos en grado actual:", currentGrade, currentCourses);

  // Errores para el grado actual
  let currentError: FormikErrors<SchoolCourseForm> | undefined = undefined;
  
  if (errors?.courseSchoolYears) {
    // Intentamos encontrar el error correspondiente para el grado actual
    for (let i = 0; i < localCourses.length; i++) {
      // Ambos deben ser números para la comparación
      const courseGrade = Number(localCourses[i]?.grade);
      if (courseGrade === currentGrade && errors.courseSchoolYears[i]) {
        currentError = errors.courseSchoolYears[i] as FormikErrors<SchoolCourseForm>;
        break;
      }
    }
  }

  // Determinar si debemos habilitar el botón de autorellenado
  const showAutoFillButton = isCreateMode;
  const autoFillButtonDisabled = localCourses.length > 0 || isLoadingCourses;
  
  // Determinar si mostrar los botones de acción basado en si hay cursos
  const showActionButtons = localCourses.length === 0;

  return (
    <div className={className}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {allGrades.map((grade, index) => (
            <Tab 
              key={grade} 
              label={gradeMapping[grade as EducationLevels] || `Grado ${grade}`} 
              value={index}
            />
          ))}
        </Tabs>
      </Box>

      <Box>
        {currentCourses.length === 0 ? (
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No hay asignaturas para este grado. {showActionButtons && "Haga clic en \"Añadir Asignatura\" para agregar una."}
            </Typography>
          </Paper>
        ) : (
          <div className="courses-list">
            {currentCourses.map((course, index) => (
              <Paper 
                key={course.id || index} 
                sx={{ 
                  p: 2, 
                  mb: 2,
                  opacity: course.localDeleted ? 0.6 : 1,
                  border: course.isDirty ? '1px solid orange' : course.isNew ? '1px solid green' : 'none'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" component="div">
                      {course.relationsInfo?.courseName || "Sin nombre"}
                      {course.isNew && (
                        <Chip 
                          label="Nuevo" 
                          size="small" 
                          color="success" 
                          sx={{ ml: 1 }} 
                        />
                      )}
                      {course.isDirty && !course.isNew && (
                        <Chip 
                          label="Modificado" 
                          size="small" 
                          color="warning" 
                          sx={{ ml: 1 }} 
                        />
                      )}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Profesor: {course.relationsInfo?.professorName || "No asignado"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Horas semanales: {course.weeklyHours || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Grado: {gradeMapping[course.grade as EducationLevels] || `Grado ${course.grade}`}
                    </Typography>
                  </Box>
                  <Box>
                    {!course.localDeleted ? (
                      <>
                        <IconButton 
                          onClick={() => handleEditCourse(course)}
                          disabled={course.localDeleted}
                        >
                          <IconEdit size={20} />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => {
                            const courseIndex = localCourses.findIndex(c => c === course);
                            if (courseIndex !== -1) {
                              onDelete(courseIndex);
                            }
                          }}
                        >
                          <IconTrash size={20} />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton 
                        color="primary" 
                        onClick={() => {
                          const courseIndex = localCourses.findIndex(c => c === course);
                          if (courseIndex !== -1) {
                            onRevertDelete(courseIndex);
                          }
                        }}
                      >
                        <IconArrowBackUp size={20} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Paper>
            ))}
          </div>
        )}
      </Box>

      {showActionButtons && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<IconCirclePlus />}
              onClick={handleAddCourse}
              ref={addCourseRef}
            >
              Añadir Asignatura
            </Button>
            
            {showAutoFillButton && (
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<IconWand />}
                onClick={handleAutoFill}
                disabled={autoFillButtonDisabled}
                title={autoFillButtonDisabled ? "Solo disponible al crear un año escolar sin asignaturas" : ""}
              >
                Rellenar automáticamente
              </Button>
            )}
          </Stack>
        </Box>
      )}

      {/* Modal para crear/editar cursos */}
      {modalOpen && (
        <CourseModal
          open={modalOpen}
          onClose={() => {
            closeModal();
            setEditingCourse(undefined);
          }}
          onSave={handleSaveCourse}
          course={editingCourse}
          grade={currentGrade}
          allowGradeEdit={true}
          error={currentError}
        />
      )}
    </div>
  );
};

export default styled(CoursesCrud)`
  .courses-list {
    display: flex;
    flex-direction: column;
  }
`; 