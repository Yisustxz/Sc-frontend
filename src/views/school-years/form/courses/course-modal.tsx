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
  MenuItem,
  Select,
  Box,
  Typography,
} from "@mui/material";
import { SchoolCourseForm } from "../types";
import { FormikErrors } from "formik";
import useGetCourses from "services/hooks/use-get-courses";
import useGetEmployees from "services/hooks/use-get-employees";
import { EducationLevels, gradeMapping } from "core/courses/use-education-levels";
import { TypeEmployee } from "core/employees/types";
import { Course } from "core/courses/types";
import { Employees } from "core/employees/types";
import OnlineAutocomplete from "components/OnlineAutocomplete";

const PROFESSOR_SEARCH_LIMIT = 20;
const COURSE_SEARCH_LIMIT = 20;

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
  const [formData, setFormData] = useState<Partial<SchoolCourseForm>>({
    courseId: undefined,
    grade: grade,
    weeklyHours: 0,
  });
  const [localErrors, setLocalErrors] = useState<FormErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [professorSearchTerm, setProfessorSearchTerm] = useState("");
  const [courseSearchTerm, setCourseSearchTerm] = useState("");

  const isUpdateMode = useMemo(() => !!course?.id, [course]);

  const modalTitle = useMemo(() => (isUpdateMode ? "Editar Asignatura" : "Añadir Asignatura"), [isUpdateMode]);

  const gradeOptions = getGradeOptions();

  const courseForceItems = useMemo(() => {
    if (course?.courseId && course.relationsInfo?.courseName) {
      return [{
        id: course.courseId,
        name: course.relationsInfo.courseName,
        grade: grade
      }];
    }
    return [];
  }, [course, grade]);

  const professorForceItems = useMemo(() => {
    if (course?.professorId && course.relationsInfo?.professorName) {
      let name = course.relationsInfo.professorName;
      let lastName = "";
      const nameParts = course.relationsInfo.professorName.split(' ');
      if (nameParts.length > 1) {
        name = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }
      return [{
        id: course.professorId,
        name,
        lastName,
        employeeType: TypeEmployee.Professor
      }];
    }

    return [];
  }, [course]);

  const { data: courses = [], isLoading: isLoadingCourses } = useGetCourses(courseForceItems, courseSearchTerm, COURSE_SEARCH_LIMIT, null);
  const { data: professors = [], isLoading: isLoadingProfessors } =
    useGetEmployees(professorForceItems, professorSearchTerm, PROFESSOR_SEARCH_LIMIT, TypeEmployee.Professor);

  useEffect(() => {
    if (course) {
      setFormData(course);
      setProfessorSearchTerm("");
      setCourseSearchTerm("");
    } else {
      setFormData({
        courseId: undefined,
        grade: grade,
        weeklyHours: 0,
      });
      setProfessorSearchTerm("");
      setCourseSearchTerm("");
    }
    setLocalErrors({});
    setAttempted(false);
  }, [course, grade, open]);

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

  const handleChange = useCallback((field: keyof SchoolCourseForm, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (attempted) {
      validateField(field, value);
    }
  }, [attempted, validateField]);

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    if (!formData.courseId) {
      newErrors.courseId = 'La asignatura es requerida';
    }
    if (formData.grade === undefined || formData.grade === null) {
      newErrors.grade = 'El grado es requerido';
    }
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

  const handleSubmit = useCallback(() => {
    setAttempted(true);
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      return;
    }
    const selectedCourse = courses.find((c) => c.id === formData.courseId);
    const selectedProfessor = professors.find(
      (p: Employees) => p.id === formData.professorId
    );
    if (!formData.courseId) {
      setLocalErrors({ ...localErrors, courseId: 'La asignatura es requerida' });
      return;
    }
    const finalData: SchoolCourseForm = {
      ...(formData as any),
      courseId: formData.courseId as number,
      grade: formData.grade as number || 1,
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
  }, [
    formData, 
    courses, 
    professors, 
    onSave, 
    onClose, 
    validateForm, 
    localErrors, 
    setAttempted, 
    setLocalErrors
  ]);

  const getError = useCallback((field: keyof FormErrors) => {
    return localErrors[field] || (error && error[field as keyof FormikErrors<SchoolCourseForm>] as string);
  }, [localErrors, error]);

  const handleProfessorSelect = useCallback((newValue: Employees | null) => {
    handleChange("professorId", newValue?.id || null);
  }, [handleChange]);

  const handleCourseSelect = useCallback((newValue: Course | null) => {
    handleChange("courseId", newValue?.id || null);
  }, [handleChange]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {modalTitle}
        {isUpdateMode && (
          <Box component="span" sx={{ ml: 1, fontSize: '0.9rem', color: 'text.secondary' }}>
            {formData.relationsInfo?.courseName && (
              <Typography variant="caption" component="span" sx={{ fontStyle: 'italic' }}>
                - ID: {formData.courseSchoolYearId || 'Nuevo'}
              </Typography>
            )}
          </Box>
        )}
      </DialogTitle>

      <DialogContent>
        <OnlineAutocomplete
          options={courses}
          value={courses.find((c) => c.id === formData.courseId) || null}
          onChange={handleCourseSelect}
          getOptionLabel={(option) => option.name}
          label="Asignatura"
          required={true}
          loading={isLoadingCourses}
          searchFn={setCourseSearchTerm}
          error={getError('courseId')}
          noOptionsText="No se encontraron asignaturas"
          loadingText="Buscando asignaturas..."
          currentSelectionLabel={formData.relationsInfo?.courseName}
          originalValue={course?.courseId}
          currentValue={formData.courseId}
        />

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

        <OnlineAutocomplete
          options={professors}
          value={professors.find((p) => p.id === formData.professorId) || null}
          onChange={handleProfessorSelect}
          getOptionLabel={(option) => `${option.name} ${option.lastName}`}
          label="Profesor"
          loading={isLoadingProfessors}
          searchFn={setProfessorSearchTerm}
          error={getError('professorId')}
          noOptionsText="No se encontraron profesores"
          loadingText="Buscando profesores..."
          currentSelectionLabel={formData.relationsInfo?.professorName}
          originalValue={course?.professorId}
          currentValue={formData.professorId}
        />

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