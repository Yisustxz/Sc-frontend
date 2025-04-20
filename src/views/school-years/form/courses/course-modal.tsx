import React, { FunctionComponent, useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  Autocomplete,
  MenuItem,
  Select,
  Box,
  Typography,
} from "@mui/material";
import { SchoolCourseForm } from "../types";
import { FormikErrors } from "formik";
import { useGetCourses } from "services/hooks/courses";
import { useGetEmployees } from "services/hooks/employees";
import { EducationLevels, gradeMapping } from "core/courses/use-education-levels";
import { TypeEmployee } from "core/employees/types";
import { Course } from "core/courses/types";
import { Employees } from "core/employees/types";

interface CourseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (course: SchoolCourseForm) => void;
  course?: SchoolCourseForm;
  grade: number;
  allowGradeEdit?: boolean;
  error?: FormikErrors<SchoolCourseForm>;
}

function getGradeOptions() {
  return Array.from({ length: 11 }, (_, i) => ({
    value: i + 1,
    label: gradeMapping[i + 1 as EducationLevels] || `Grado ${i + 1}`
  }));
}

// Interfaz para errores locales del formulario
interface FormErrors {
  courseId?: string;
  grade?: string;
  professorId?: string;
  weeklyHours?: string;
}

const CourseModal: FunctionComponent<CourseModalProps> = ({
  open,
  onClose,
  onSave,
  course,
  grade,
  allowGradeEdit = false,
  error,
}) => {
  // Estado del formulario
  const [formData, setFormData] = useState<Partial<SchoolCourseForm>>({
    courseId: undefined,
    grade: grade,
    weeklyHours: 0,
  });
  
  // Estado para errores locales
  const [localErrors, setLocalErrors] = useState<FormErrors>({});
  // Estado para controlar si ya se intentó enviar el formulario
  const [attempted, setAttempted] = useState(false);

  // Determinar si estamos en modo edición o creación
  const isUpdateMode = useMemo(() => {
    return !!course?.id;
  }, [course]);

  const modalTitle = useMemo(() => {
    return isUpdateMode ? "Editar Asignatura" : "Añadir Asignatura";
  }, [isUpdateMode]);

  const gradeOptions = getGradeOptions();

  // Cargar datos de cursos y profesores
  const { data: courses = [], isLoading: coursesLoading } = useGetCourses();

  // Usar el hook mejorado de useGetEmployees con el filtro por rol 'PROFESSOR'
  const { data: professors = [], isLoading: professorsLoading } =
    useGetEmployees({
      role: "PROFESSOR", // Esto se convertirá a lowercase en el hook
    });

  // Generar lista extendida de cursos usando useMemo
  const extendedCourses = useMemo(() => {
    let result = [...courses];
    
    // Si estamos en modo edición y hay un curso seleccionado
    if (course?.courseId && !courses.some(c => c.id === course.courseId) && course.relationsInfo?.courseName) {
      console.log("Añadiendo curso que no está en las opciones: ", course.courseId, course.relationsInfo.courseName);
      
      // Crear un objeto Course temporal para añadirlo a las opciones
      const missingCourse: Course = {
        id: course.courseId,
        name: course.relationsInfo.courseName,
        grade: grade,
        createdAt: new Date().toISOString()
      };
      
      // Añadir el curso al principio para que sea más visible
      result = [missingCourse, ...result];
    }
    
    return result;
  }, [courses, course, grade]);
  
  // Generar lista extendida de profesores usando useMemo
  const extendedProfessors = useMemo(() => {
    let result = [...professors];
    
    // Si estamos en modo edición y hay un profesor seleccionado
    if (course?.professorId && !professors.some(p => p.id === course.professorId) && course.relationsInfo?.professorName) {
      console.log("Añadiendo profesor que no está en las opciones: ", course.professorId, course.relationsInfo.professorName);
      
      // Extraer nombre y apellido si es posible
      let name = course.relationsInfo.professorName;
      let lastName = "";
      
      // Intentar separar el nombre completo en nombre y apellido
      const nameParts = course.relationsInfo.professorName.split(' ');
      if (nameParts.length > 1) {
        name = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }
      
      // Crear un objeto Employee temporal para añadirlo a las opciones
      const missingProfessor: Employees = {
        id: course.professorId,
        name: name,
        lastName: lastName,
        dni: "",
        phone: "",
        direction: "",
        birthDate: "",
        employeeType: TypeEmployee.Professor
      };
      
      // Añadir el profesor al principio para que sea más visible
      result = [missingProfessor, ...result];
    }
    
    return result;
  }, [professors, course]);

  // Función para actualizar formData cuando cambian las props
  useEffect(() => {
    if (course) {
      setFormData(course);
    } else {
      setFormData({
        courseId: undefined,
        grade: grade,
        weeklyHours: 0,
      });
    }
    
    // Resetear los errores y el estado de intento cuando cambia el modal
    setLocalErrors({});
    setAttempted(false);
  }, [course, grade, open]);


  // Validar un campo específico
  const validateField = useCallback((field: keyof SchoolCourseForm, value: any) => {
    const newErrors = { ...localErrors };
    
    switch (field) {
      case 'courseId':
        if (!value) {
          newErrors.courseId = 'La asignatura es requerida';
        } else {
          delete newErrors.courseId;
        }
        break;
      case 'grade':
        if (value === undefined || value === null) {
          newErrors.grade = 'El grado es requerido';
        } else {
          delete newErrors.grade;
        }
        break;
      case 'weeklyHours':
        if (value < 0) {
          newErrors.weeklyHours = 'Las horas semanales deben ser un número positivo';
        } else if (value > 40) {
          newErrors.weeklyHours = 'Las horas semanales no pueden exceder 40';
        } else {
          delete newErrors.weeklyHours;
        }
        break;
    }
    
    setLocalErrors(newErrors);
    return newErrors;
  }, [localErrors]);
  
  // Manejar cambios en el formulario (con useCallback)
  const handleChange = useCallback((field: keyof SchoolCourseForm, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Si ya hubo un intento de envío, validamos en tiempo real
    if (attempted) {
      validateField(field, value);
    }
  }, [attempted, validateField]);
  

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    
    // Validar courseId (obligatorio)
    if (!formData.courseId) {
      newErrors.courseId = 'La asignatura es requerida';
    }
    
    // Validar grade (obligatorio)
    if (formData.grade === undefined || formData.grade === null) {
      newErrors.grade = 'El grado es requerido';
    }
    
    // Validar weeklyHours
    if (formData.weeklyHours !== undefined) {
      if (formData.weeklyHours < 0) {
        newErrors.weeklyHours = 'Las horas semanales deben ser un número positivo';
      } else if (formData.weeklyHours > 40) {
        newErrors.weeklyHours = 'Las horas semanales no pueden exceder 40';
      }
    }
    
    setLocalErrors(newErrors);
    return newErrors;
  }, [formData]);

  // Manejar submit del formulario (con useCallback)
  const handleSubmit = useCallback(() => {
    setAttempted(true);
    const errors = validateForm();
    
    // Si hay errores, no enviamos el formulario
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    // Buscar datos adicionales del curso y profesor seleccionados
    const selectedCourse = extendedCourses.find((c) => c.id === formData.courseId);
    const selectedProfessor = extendedProfessors.find(
      (p) => p.id === formData.professorId
    );

    // Verificar que courseId sea un número válido
    if (!formData.courseId) {
      setLocalErrors({ ...localErrors, courseId: 'La asignatura es requerida' });
      return;
    }

    // Estructura con relationsInfo separado
    const finalData: SchoolCourseForm = {
      ...(formData as any),
      courseId: formData.courseId as number,
      grade: formData.grade as number || 1, // Valor por defecto para evitar undefined
      professorId: formData.professorId as number | undefined,
      weeklyHours: formData.weeklyHours || 0,
      relationsInfo: {
        courseName: selectedCourse?.name || formData.relationsInfo?.courseName || "(Sin nombre)",
        professorName: selectedProfessor
          ? `${selectedProfessor.name} ${selectedProfessor.lastName}`
          : formData.relationsInfo?.professorName || "(Sin nombre)",
      }
    };

    onSave(finalData);
    onClose();
  }, [formData, extendedCourses, extendedProfessors, onSave, onClose, validateForm, localErrors]);

  // Determinar qué errores mostrar (priorizar errores locales sobre los externos)
  const getError = useCallback((field: keyof FormErrors) => {
    return localErrors[field] || (error && error[field as keyof FormikErrors<SchoolCourseForm>] as string);
  }, [localErrors, error]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {modalTitle}
        {isUpdateMode && (
          <Box component="span" sx={{ ml: 1, fontSize: '0.9rem', color: 'text.secondary' }}>
            {/* Mostrar información útil en modo edición */}
            {formData.relationsInfo?.courseName && (
              <Typography variant="caption" component="span" sx={{ fontStyle: 'italic' }}>
                - ID: {formData.courseSchoolYearId || 'Nuevo'}
              </Typography>
            )}
          </Box>
        )}
      </DialogTitle>

      <DialogContent>
        <FormControl fullWidth margin="normal" error={!!getError('courseId')}>
          <Autocomplete
            options={extendedCourses}
            getOptionLabel={(option) => option.name}
            loading={coursesLoading}
            value={extendedCourses.find((c) => c.id === formData.courseId) || null}
            onChange={(_, newValue) => {
              handleChange("courseId", newValue?.id || null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Asignatura"
                required
                error={!!getError('courseId')}
                helperText={getError('courseId')}
              />
            )}
          />
        </FormControl>

        {allowGradeEdit && (
          <FormControl fullWidth margin="normal" error={!!getError('grade')}>
            <InputLabel id="grade-select-label">Grado</InputLabel>
            <Select
              labelId="grade-select-label"
              id="grade-select"
              value={formData.grade}
              label="Grado"
              onChange={(e) => handleChange("grade", Number(e.target.value))}
            >
              {gradeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {getError('grade') && <FormHelperText>{getError('grade')}</FormHelperText>}
          </FormControl>
        )}

        <FormControl fullWidth margin="normal" error={!!getError('professorId')}>
          <Autocomplete
            options={extendedProfessors}
            getOptionLabel={(option) =>
              `${option.name} ${option.lastName}`
            }
            loading={professorsLoading}
            value={
              extendedProfessors.find((p) => p.id === formData.professorId) || null
            }
            onChange={(_, newValue) => {
              handleChange("professorId", newValue?.id || null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Profesor"
                error={!!getError('professorId')}
                helperText={getError('professorId')}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!getError('weeklyHours')}>
          <TextField
            label="Horas Semanales"
            type="number"
            value={formData.weeklyHours || 0}
            onChange={(e) =>
              handleChange("weeklyHours", parseInt(e.target.value, 10))
            }
            InputProps={{ inputProps: { min: 0, max: 40 } }}
            error={!!getError('weeklyHours')}
            helperText={getError('weeklyHours')}
          />
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant={isUpdateMode ? "outlined" : "contained"}
        >
          {isUpdateMode ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseModal; 