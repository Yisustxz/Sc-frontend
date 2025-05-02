import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { 
  Grid, 
  TextField, 
  MenuItem, 
  Button, 
  FormHelperText, 
  Typography, 
  Box,
  Autocomplete,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Paper,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemButton
} from '@mui/material';
import { 
  IconSearch, 
  IconChevronRight, 
  IconUser, 
  IconCalendar, 
  IconSchool,
  IconCirclePlus,
  IconCircleCheck,
  IconCircleX,
  IconPlus,
  IconTrash
} from '@tabler/icons';
import styled from 'styled-components';
import useGetStudents from 'services/hooks/use-get-students';
import useGetSchoolYears from 'services/hooks/use-get-school-years';
import { CreateInscriptionDto, UpdateInscriptionDto, StudentDto, CourseSchoolYearDto } from 'core/inscriptions/types/index';
import { gradeMapping, EducationLevels, getLevelsAsOptions } from 'core/courses/use-education-levels';
import useGetCoursesSchoolYear from 'services/hooks/use-get-courses-school-year';

// Tipo para la interfaz de curso
interface CourseType extends CourseSchoolYearDto {}

// Tipo para la interfaz de estudiante
interface StudentType extends StudentDto {}

// Interfaz para los valores del formulario
interface FormValues {
  studentId: number;
  schoolYearId: number;
  grade: string;
  courseIds: number[];
}

// Interfaz para las propiedades del componente
interface InscriptionFormProps {
  onSubmit: (data: CreateInscriptionDto) => void | Promise<void>;
  initialValues?: UpdateInscriptionDto;
  isEdit?: boolean;
  className?: string;
}

const EMPTY_ARRAY_REF = [] as any[];

const InscriptionForm = ({ 
  onSubmit, 
  initialValues, 
  isEdit = false,
  className
}: InscriptionFormProps) => {
  // Estados para manejo de los campos del formulario
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<number | null>(null);
  const [selectedCoursesSchoolYear, setSelectedCoursesSchoolYear] = useState<number[]>([]);
  
  // Datos para los selects
  const { data: students = [], isLoading: loadingStudents } = useGetStudents(undefined, studentSearch, null);
  const { data: schoolYears = [], isLoading: loadingSchoolYears } = useGetSchoolYears(EMPTY_ARRAY_REF,'');
  
  // Obtener cursos por año escolar y grado
  const { 
    data: coursesSchoolYear = [], 
    isLoading: loadingCoursesSchoolYear 
  } = useGetCoursesSchoolYear(
    selectedSchoolYear || 0,
    // No filtramos por grado para mostrar todos los cursos disponibles
    ''
  );

  // Agrupar cursos por grado para mejor visualización
  const coursesByGrade = useMemo(() => {
    const grouped: Record<string, CourseType[]> = {};
    
    // Recorrer directamente el array de cursos
    coursesSchoolYear.forEach((course: CourseType) => {
      const grade = String(course.grade || '');
      if (!grouped[grade]) {
        grouped[grade] = [];
      }
      grouped[grade].push(course);
    });
    
    return grouped;
  }, [coursesSchoolYear]);

  // Opciones de grado
  const gradeOptions = getLevelsAsOptions();

  // Configuración del formulario con react-hook-form
  const { 
    control, 
    handleSubmit, 
    setValue, 
    formState: { errors }, 
    watch 
  } = useForm<FormValues>({
    defaultValues: {
      studentId: initialValues?.studentId || 0,
      schoolYearId: initialValues?.schoolYearId || 0,
      grade: initialValues?.grade || '',
      courseIds: initialValues?.courseInscriptions?.map(c => c.courseSchoolYearId) || []
    }
  });

  // Valores actuales del formulario
  const formValues = watch();

  // Cargar valores iniciales si estamos en modo edición
  useEffect(() => {
    if (isEdit && initialValues) {
      setValue('studentId', initialValues.studentId || 0);
      setValue('schoolYearId', initialValues.schoolYearId || 0);
      setValue('grade', initialValues.grade || '');
      setValue('courseIds', initialValues.courseInscriptions?.map(c => c.courseSchoolYearId) || []);
      
      // Actualizar estados locales
      setSelectedSchoolYear(initialValues.schoolYearId || null);
      setSelectedGrade(initialValues.grade || '');
      setSelectedCoursesSchoolYear(initialValues.courseInscriptions?.map(c => c.courseSchoolYearId) || []);
    }
  }, [isEdit, initialValues, setValue]);

  // Mapear datos del formulario al formato esperado por la API
  const mapFormValuesToDto = useCallback((data: FormValues): CreateInscriptionDto => {
    return {
      studentId: data.studentId,
      schoolYearId: data.schoolYearId,
      grade: data.grade,
      courseInscriptions: data.courseIds.map(courseSchoolYearId => ({
        courseSchoolYearId
      }))
    };
  }, []);

  // Manejar envío del formulario
  const handleFormSubmit = useCallback((data: FormValues) => {
    const dto = mapFormValuesToDto(data);
    onSubmit(dto);
  }, [onSubmit, mapFormValuesToDto]);

  // Manejar cambio de estudiante
  const handleStudentChange = useCallback((event: React.SyntheticEvent, newValue: StudentType | null) => {
    if (newValue) {
      setValue('studentId', newValue.id);
    } else {
      setValue('studentId', 0);
    }
  }, [setValue]);

  // Manejar cambio de año escolar
  const handleSchoolYearChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const id = Number(event.target.value);
    setValue('schoolYearId', id);
    setSelectedSchoolYear(id);
    // Al cambiar el año escolar, limpiamos los cursos seleccionados
    setValue('courseIds', []);
    setSelectedCoursesSchoolYear([]);
  }, [setValue]);

  // Manejar cambio de grado
  const handleGradeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const grade = event.target.value;
    setValue('grade', grade);
    setSelectedGrade(grade);
  }, [setValue]);

  // Manejar selección de todos los cursos de un grado
  const handleSelectAllGradeCourses = useCallback((grade: string) => {
    const coursesInGrade = coursesByGrade[grade] || [];
    const courseIds = coursesInGrade.map((course: CourseType) => course.id);
    
    // Verificamos cuáles de estos cursos ya están seleccionados
    const currentCourseIds = [...selectedCoursesSchoolYear];
    
    // Si todos los cursos del grado ya están seleccionados, los quitamos
    const allSelected = courseIds.every((id: number) => currentCourseIds.includes(id));
    
    let newSelectedCourses;
    if (allSelected) {
      // Quitar todos los cursos del grado
      newSelectedCourses = currentCourseIds.filter((id: number) => !courseIds.includes(id));
    } else {
      // Añadir todos los cursos del grado que no estén ya seleccionados
      const coursesToAdd = courseIds.filter((id: number) => !currentCourseIds.includes(id));
      newSelectedCourses = [...currentCourseIds, ...coursesToAdd];
    }
    
    setSelectedCoursesSchoolYear(newSelectedCourses);
    setValue('courseIds', newSelectedCourses);
  }, [coursesByGrade, selectedCoursesSchoolYear, setValue]);

  // Manejar selección individual de cursos
  const handleCourseChange = useCallback((courseId: number, isSelected: boolean) => {
    let newSelectedCourses;
    
    if (isSelected) {
      // Añadir curso si no está ya seleccionado
      newSelectedCourses = [...selectedCoursesSchoolYear, courseId];
    } else {
      // Eliminar curso
      newSelectedCourses = selectedCoursesSchoolYear.filter(id => id !== courseId);
    }
    
    setSelectedCoursesSchoolYear(newSelectedCourses);
    setValue('courseIds', newSelectedCourses);
  }, [selectedCoursesSchoolYear, setValue]);


  // Renderizar opciones de cursos en diseño de dos columnas
  const renderCourseOptions = useCallback(() => {
    if (!selectedSchoolYear) {
      return (
        <Box className="empty-courses-message">
          <Typography variant="body1" color="textSecondary">
            Selecciona un año escolar para ver los cursos disponibles
          </Typography>
        </Box>
      );
    }

    if (loadingCoursesSchoolYear) {
      return (
        <Box className="loading-courses">
          <Typography variant="body1" color="textSecondary">
            Cargando cursos...
          </Typography>
        </Box>
      );
    }

    if (Object.keys(coursesByGrade).length === 0) {
      return (
        <Box className="empty-courses-message">
          <Typography variant="body1" color="textSecondary">
            No hay cursos disponibles para este año escolar
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Panel izquierdo: Materias disponibles */}
        <Paper sx={{ 
          flex: 1, 
          p: 2,
          maxHeight: '400px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" component="h3">
              Materias Disponibles
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {/* Lista con scroll */}
          <Box sx={{ 
            overflowY: 'auto',
            flex: 1,
            pr: 1
          }}>
            {Object.entries(coursesByGrade)
              .sort(([gradeA], [gradeB]) => Number(gradeA) - Number(gradeB))
              .map(([grade, courses]) => {
                // Filtrar solo los cursos que no están seleccionados
                const availableCourses = courses.filter(
                  (course: CourseType) => !selectedCoursesSchoolYear.includes(course.id)
                );
                
                // No mostrar el grado si no hay cursos disponibles
                if (availableCourses.length === 0) return null;
                
                return (
                  <Box key={`available-${grade}`} sx={{ mb: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mb: 1 
                    }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {gradeMapping[Number(grade) as EducationLevels] || `Grado ${grade}`}
                      </Typography>
                      <Button 
                        size="small"
                        onClick={() => handleSelectAllGradeCourses(grade)}
                        startIcon={<IconCirclePlus size={16} />}
                        sx={{ minWidth: 'auto', py: 0.5 }}
                      >
                        Agregar todos
                      </Button>
                    </Box>
                    
                    <List dense disablePadding sx={{ ml: 1 }}>
                      {availableCourses.map((course: CourseType) => (
                        <ListItem 
                          key={`available-course-${course.id}`}
                          disablePadding
                          secondaryAction={
                            <IconButton 
                              edge="end" 
                              size="small"
                              onClick={() => handleCourseChange(course.id, true)}
                            >
                              <IconPlus size={16} />
                            </IconButton>
                          }
                        >
                          <ListItemButton
                            dense
                            onClick={() => handleCourseChange(course.id, true)}
                            sx={{ py: 0.5 }}
                          >
                            <Typography variant="body2">
                              {course.course?.name || 'Sin nombre'}
                            </Typography>
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                );
              })}
          </Box>
        </Paper>
        
        {/* Panel derecho: Materias seleccionadas */}
        <Paper sx={{ 
          flex: 1, 
          p: 2,
          maxHeight: '400px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" component="h3">
              Materias Seleccionadas
            </Typography>
            
            <Typography variant="caption" color="text.secondary">
              {selectedCoursesSchoolYear.length} materias
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {selectedCoursesSchoolYear.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 8,
              color: 'text.secondary'
            }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                No hay materias seleccionadas
              </Typography>
            </Box>
          ) : (
            <Box sx={{ overflowY: 'auto', pr: 1, flex: 1 }}>
              {Object.entries(coursesByGrade)
                .sort(([gradeA], [gradeB]) => Number(gradeA) - Number(gradeB))
                .map(([grade, courses]) => {
                  // Filtrar solo los cursos que están seleccionados
                  const selectedCourses = courses.filter(
                    (course: CourseType) => selectedCoursesSchoolYear.includes(course.id)
                  );
                  
                  // No mostrar el grado si no hay cursos seleccionados
                  if (selectedCourses.length === 0) return null;
                  
                  return (
                    <Box key={`selected-${grade}`} sx={{ mb: 2 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 1 
                      }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {gradeMapping[Number(grade) as EducationLevels] || `Grado ${grade}`}
                        </Typography>
                        
                        <Button 
                          size="small"
                          color="secondary"
                          onClick={() => handleSelectAllGradeCourses(grade)}
                          startIcon={<IconTrash size={16} />}
                          sx={{ minWidth: 'auto', py: 0.5 }}
                        >
                          Quitar todos
                        </Button>
                      </Box>
                      
                      <List dense disablePadding sx={{ ml: 1 }}>
                        {selectedCourses.map((course: CourseType) => (
                          <ListItem 
                            key={`selected-course-${course.id}`}
                            disablePadding
                            secondaryAction={
                              <IconButton 
                                edge="end" 
                                size="small"
                                color="error"
                                onClick={() => handleCourseChange(course.id, false)}
                              >
                                <IconTrash size={16} />
                              </IconButton>
                            }
                          >
                            <ListItemButton
                              dense
                              onClick={() => handleCourseChange(course.id, false)}
                              sx={{ py: 0.5 }}
                            >
                              <Typography variant="body2">
                                {course.course?.name || 'Sin nombre'}
                              </Typography>
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  );
                })}
            </Box>
          )}
        </Paper>
      </Box>
    );
  }, [
    selectedSchoolYear, 
    loadingCoursesSchoolYear, 
    coursesByGrade, 
    selectedCoursesSchoolYear, 
    handleCourseChange, 
    handleSelectAllGradeCourses
  ]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={`inscription-form ${className}`}>
      <Grid container spacing={3}>
        {/* Estudiante */}
        <Grid item xs={12} md={6} className="student-field">
          <Controller
            name="studentId"
            control={control}
            rules={{ 
              required: 'El estudiante es requerido',
              validate: (value: number) => value > 0 || 'Debe seleccionar un estudiante'
            }}
            render={({ field }) => (
              <Autocomplete
                options={students}
                getOptionLabel={(option: StudentType) => `${option.name} ${option.lastName || ''}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Estudiante"
                    variant="outlined"
                    error={!!errors.studentId}
                    helperText={errors.studentId?.message}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <IconUser className="field-icon" size={18} />
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                    placeholder="Buscar estudiante..."
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />
                )}
                onChange={handleStudentChange}
                value={students.find((s: StudentType) => s.id === formValues.studentId) || null}
                disabled={isEdit}
                fullWidth
              />
            )}
          />
        </Grid>

        {/* Año Escolar */}
        <Grid item xs={12} md={6} className="school-year-field">
          <Controller
            name="schoolYearId"
            control={control}
            rules={{ 
              required: 'El año escolar es requerido',
              validate: (value: number) => value > 0 || 'Debe seleccionar un año escolar'
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Año Escolar"
                variant="outlined"
                error={!!errors.schoolYearId}
                helperText={errors.schoolYearId?.message}
                InputProps={{
                  startAdornment: <IconCalendar className="field-icon" size={18} />
                }}
                onChange={handleSchoolYearChange}
                value={field.value || ''}
              >
                <MenuItem value="0" disabled>Selecciona un año escolar</MenuItem>
                {schoolYears.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.code}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Grado */}
        <Grid item xs={12} md={6} className="grade-field">
          <Controller
            name="grade"
            control={control}
            rules={{ required: 'El grado es requerido' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Grado"
                variant="outlined"
                error={!!errors.grade}
                helperText={errors.grade?.message}
                InputProps={{
                  startAdornment: <IconSchool className="field-icon" size={18} />
                }}
                onChange={handleGradeChange}
                value={field.value || ''}
              >
                <MenuItem value="" disabled>Selecciona un grado</MenuItem>
                {gradeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Espacio vacío para alineación */}
        <Grid item xs={12} md={6} />

        {/* Selección de Materias */}
        <Grid item xs={12}>
          <Typography variant="h5" className="section-title">
            Materias Disponibles
          </Typography>
          <Typography variant="body2" color="textSecondary" className="section-description">
            Selecciona las materias para inscribir al estudiante:
          </Typography>
          <Divider className="section-divider" />
          
          <Controller
            name="courseIds"
            control={control}
            rules={{
              validate: (value: number[]) => value.length > 0 || 'Debe seleccionar al menos una materia'
            }}
            render={({ field }) => (
              <div>
                {renderCourseOptions()}
                {errors.courseIds && (
                  <FormHelperText error>{errors.courseIds.message}</FormHelperText>
                )}
              </div>
            )}
          />
        </Grid>

        {/* Botones de acción */}
        <Grid item xs={12} className="action-buttons">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            className="submit-button"
          >
            {isEdit ? 'Actualizar Inscripción' : 'Crear Inscripción'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default styled(InscriptionForm)`
  width: 100%;
  padding: 16px 0;

  .field-icon {
    color: #673ab7;
    margin-right: 8px;
  }

  .section-title {
    margin-top: 16px;
    margin-bottom: 4px;
    font-weight: 500;
  }

  .section-description {
    margin-bottom: 8px;
  }

  .section-divider {
    margin-bottom: 16px;
  }

  .empty-courses-message, .loading-courses, .empty-selection {
    padding: 32px;
    text-align: center;
    background-color: #f5f5f5;
    border-radius: 8px;
    margin: 16px 0;
  }

  .grade-courses-card {
    margin-bottom: 16px;
  }

  .grade-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .grade-card-header {
    padding-bottom: 0;
  }

  .grade-card-content {
    padding-top: 8px;
  }

  .course-checkbox {
    margin: 0;
  }

  .course-label {
    font-size: 0.875rem;
  }

  .selected-courses-container {
    background-color: #fafafa;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
  }

  .selected-courses-count {
    margin-bottom: 16px;
  }

  .course-count-chip {
    font-weight: 500;
  }

  .grade-section {
    margin-bottom: 16px;
  }

  .grade-title {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .grade-count-chip {
    margin-left: 8px;
  }

  .selected-course-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .course-chip {
    margin: 4px;
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .submit-button {
    padding: 8px 24px;
    text-transform: none;
    font-weight: 500;
    height: 40px;
  }

  .select-all-button {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
`; 