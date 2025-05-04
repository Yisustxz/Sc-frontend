import { FunctionComponent, useState, useCallback, useEffect, useMemo, useRef } from 'react'
import * as Yup from 'yup'
import { Formik, FormikHelpers, FormikProps } from 'formik'
// material-ui
import MainCard from 'components/cards/MainCard'
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
  Typography,
  Divider,
  Box,
  Paper,
  List,
  ListItem,
  ListItemButton,
  IconButton
} from '@mui/material'
import styled from 'styled-components'
import { IconCalendar, IconCirclePlus, IconPlus, IconSchool, IconTrash, IconUser } from '@tabler/icons'
import { gradeMapping, EducationLevels, getLevelsAsOptions } from 'core/courses/use-education-levels'
import { StudentDto, SchoolYearDto, CourseSchoolYearDto } from 'core/inscriptions/types/index'
import useGetSchoolYears from 'services/hooks/use-get-school-years'
import useGetStudents from 'services/hooks/use-get-students'
import OnlineAutocomplete from 'components/OnlineAutocomplete'
import { Controller } from 'react-hook-form'
import useGetCoursesSchoolYear from 'services/hooks/use-get-courses-school-year'

const EMPTY_ARRAY_REF = [] as any[]
const LIMIT_ITEMS_STUDENTS = 15;

// Tipo para la interfaz de curso
interface CourseType extends CourseSchoolYearDto {}

// Tipo para la interfaz de estudiante
interface StudentType extends StudentDto {}

function useCoursesByGradeDictionary(coursesSchoolYear: CourseType[]) {
  return useMemo(() => {
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
}

function useGetStudentsForForm(initialValues: FormValues, studentSearch: string) {
  // Referencias estables para IDs a forzar
  const studentsToForce = useMemo(() => {
    return initialValues?.studentId ? [initialValues.studentId] : []
  }, [initialValues?.studentId])

  const { data: students = [], isLoading: loadingStudents } = useGetStudents(
    studentsToForce,
    studentSearch,
    LIMIT_ITEMS_STUDENTS
  );

  return { students, loadingStudents };
}

function useGetSchoolYearsForForm(initialValues: FormValues, schoolYearSearch: string) {
  // Referencias estables para IDs a forzar
  const schoolYearsToForce = useMemo(() => {
    return initialValues?.schoolYearId ? [initialValues.schoolYearId] : []
  }, [initialValues?.schoolYearId])
  
  const { data: schoolYears = [], isLoading: loadingSchoolYears } = useGetSchoolYears(
    schoolYearsToForce,
    schoolYearSearch
  );

  return { schoolYears, loadingSchoolYears };
}

const InscriptionForm: FunctionComponent<Props> = ({
  className,
  title,
  onSubmit,
  initialValues,
  isUpdate
}) => {
  // Estados para las búsquedas
  const [studentSearch, setStudentSearch] = useState('');
  const [schoolYearSearch, setSchoolYearSearch] = useState('');
  const formikRef = useRef<FormikProps<FormValues>>(null);

  // Estados para selección de cursos
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<number | null>(initialValues.schoolYearId || null);
  const [selectedGrade, setSelectedGrade] = useState<string>(initialValues.grade || '');
  const [selectedCoursesSchoolYear, setSelectedCoursesSchoolYear] = useState<number[]>([]);

  // Obtener cursos por año escolar y grado
  const { 
    data: coursesSchoolYear = [], 
    isLoading: loadingCoursesSchoolYear 
  } = useGetCoursesSchoolYear(
    selectedSchoolYear || 0,
  );

  // Inicializar los cursos seleccionados desde initialValues al cargar el componente
  useEffect(() => {
    console.log('initialValues.courseInscriptions', initialValues.courseInscriptions);
    if (initialValues.courseInscriptions && initialValues.courseInscriptions.length > 0) {
      const courseIds = initialValues.courseInscriptions.map(item => item.courseSchoolYearId);
      setSelectedCoursesSchoolYear(courseIds);
    }
  }, [initialValues.courseInscriptions]);

  // Asegurarnos de que courseInscriptions se mantenga actualizado en el formulario
  useEffect(() => {
    console.log('selectedCoursesSchoolYear', selectedCoursesSchoolYear);
    if (formikRef.current) {
      const courseInscriptions = selectedCoursesSchoolYear.map(id => ({ courseSchoolYearId: id }));
      formikRef.current.setFieldValue('courseInscriptions', courseInscriptions);
    }
  }, [selectedCoursesSchoolYear]);

  // Agrupar cursos por grado para mejor visualización
  const coursesByGrade = useCoursesByGradeDictionary(coursesSchoolYear);
  // Obtener estudiantes y años escolares para el formulario
  const { students, loadingStudents } = useGetStudentsForForm(initialValues, studentSearch);
  const { schoolYears, loadingSchoolYears } = useGetSchoolYearsForForm(initialValues, schoolYearSearch);

  const setFieldValue = useCallback((field: string, value: any) => {
    if (formikRef.current) {
      formikRef.current.setFieldValue(field, value);
    }
  }, []);
  

  // Opciones de grado para el selector
  const gradeOptions = getLevelsAsOptions();

  // Callbacks memoizados para evitar renderizados innecesarios
  const handleStudentChange = useCallback((newValue: any | null) => {
    if (formikRef.current && newValue) {
      formikRef.current.setFieldValue('studentId', newValue.id);
    } else if (formikRef.current) {
      formikRef.current.setFieldValue('studentId', null);
    }
  }, []);
  
  const handleSchoolYearChange = useCallback((newValue: any | null) => {
    if (formikRef.current && newValue) {
      formikRef.current.setFieldValue('schoolYearId', newValue.id);
      setSelectedSchoolYear(newValue.id);
    } else if (formikRef.current) {
      formikRef.current.setFieldValue('schoolYearId', null);
      setSelectedSchoolYear(null);
    }
  }, []);
  
  const getStudentOptionLabel = useCallback((option: any) => {
    return option.name && option.lastName && option.dni
      ? `${option.name} ${option.lastName} - ${option.dni || 'Sin cédula'}`
      : option.name && option.lastName
        ? `${option.name} ${option.lastName}`
        : option.name || '';
  }, []);
  
  const getSchoolYearOptionLabel = useCallback((option: any) => {
    return option.code;
  }, []);

  // Definir validaciones
  const validationSchema = Yup.object().shape({
    studentId: Yup.number()
      .required('El estudiante es requerido')
      .positive('Seleccione un estudiante válido'),
    schoolYearId: Yup.number()
      .required('El año escolar es requerido')
      .positive('Seleccione un año escolar válido'),
    grade: Yup.string()
      .required('El grado es requerido'),
    courseInscriptions: Yup.array()
      .of(Yup.object().shape({
        courseSchoolYearId: Yup.number()
          .required('La materia es requerida')
          .positive('Seleccione una materia válida')
      }))
  });

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
  }, [coursesByGrade, selectedCoursesSchoolYear, setFieldValue]);

  // Auto add courses when grade is selected and nothing courses was added
  const automaticAddCoursesFromGrade = useCallback(() => {
    if (selectedSchoolYear && selectedGrade && selectedCoursesSchoolYear.length === 0) {
      handleSelectAllGradeCourses(+selectedGrade, true);
    }
  }, [selectedSchoolYear, selectedCoursesSchoolYear, selectedGrade, handleSelectAllGradeCourses]);

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
  }, [selectedCoursesSchoolYear, setFieldValue]);
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

  // Renderizar opciones de cursos en diseño de dos columnas
  const renderCourseOptions = useCallback(() => {
    console.log('selectedSchoolYear', selectedSchoolYear);
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
            {Object.entries(coursesByGradeUnselected)
              .sort(([gradeA], [gradeB]) => Number(gradeA) - Number(gradeB))
              .map(([grade, courses]) => {
                // No mostrar el grado si no hay cursos disponibles
                if (courses.length === 0) return null;

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
                        onClick={() => handleSelectAllGradeCourses(+grade, true)}
                        startIcon={<IconCirclePlus size={16} />}
                        sx={{ minWidth: 'auto', py: 0.5 }}
                      >
                        Agregar todos
                      </Button>
                    </Box>

                    <List dense disablePadding sx={{ ml: 1 }}>
                      {courses.map((course: CourseType) => (
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
          
          {selectedCoursesSchoolYear.length <= 0 ? (
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
              {selectedGrade && (
                <Button 
                  variant="outlined"
                  color="primary"
                  onClick={automaticAddCoursesFromGrade}
                >
                  Agregar materias del grado {selectedGrade}
                </Button>
              )}
            </Box>
          ) : (
            <Box sx={{ overflowY: 'auto', pr: 1, flex: 1 }}>
              {Object.entries(coursesByGradeSelected)
                .sort(([gradeA], [gradeB]) => Number(gradeA) - Number(gradeB))
                .map(([grade, courses]) => {
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
                          onClick={() => handleSelectAllGradeCourses(+grade, false)}
                          startIcon={<IconTrash size={16} />}
                          sx={{ minWidth: 'auto', py: 0.5 }}
                        >
                          Quitar todos
                        </Button>
                      </Box>
                      
                      <List dense disablePadding sx={{ ml: 1 }}>
                        {courses.map((course: CourseType) => (
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
    coursesByGradeUnselected, 
    coursesByGradeSelected, 
    selectedCoursesSchoolYear, 
    selectedGrade, 
    automaticAddCoursesFromGrade, 
    handleSelectAllGradeCourses, 
    handleCourseChange
  ]);

  return (
    <div className={className}>
      <Formik
        validateOnChange={true}
        validateOnBlur={false}
        validateOnMount={false}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit as any}
        innerRef={formikRef}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <MainCard className="form-data" title={title}>
              <Grid container spacing={3}>
                {/* Estudiante */}
                <Grid item xs={12} md={6}>
                  <OnlineAutocomplete
                    showSelection={false}
                    options={Array.isArray(students) ? students : []}
                    onChange={handleStudentChange}
                    getOptionLabel={getStudentOptionLabel}
                    label="Estudiante"
                    required={true}
                    loading={loadingStudents}
                    searchFn={setStudentSearch}
                    error={touched.studentId && errors.studentId ? String(errors.studentId) : undefined}
                    noOptionsText="No se encontraron estudiantes"
                    loadingText="Buscando estudiantes..."
                    originalValue={initialValues.studentId || null}
                    currentValue={values.studentId || null}
                    startAdornment={<IconUser stroke={1.5} size="1.3rem" />}
                    disabled={isUpdate}
                  />
                </Grid>

                {/* Año Escolar */}
                <Grid item xs={12} md={6}>
                  <OnlineAutocomplete
                    showSelection={false}
                    options={Array.isArray(schoolYears) ? schoolYears : []}
                    onChange={handleSchoolYearChange}
                    getOptionLabel={getSchoolYearOptionLabel}
                    label="Año Escolar"
                    required={true}
                    loading={loadingSchoolYears}
                    searchFn={setSchoolYearSearch}
                    error={touched.schoolYearId && errors.schoolYearId ? String(errors.schoolYearId) : undefined}
                    noOptionsText="No se encontraron años escolares"
                    loadingText="Buscando años escolares..."
                    originalValue={initialValues.schoolYearId || null}
                    currentValue={values.schoolYearId || null}
                    startAdornment={<IconCalendar stroke={1.5} size="1.3rem" />}
                  />
                </Grid>

                {/* Grado */}
                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.grade && errors.grade)}
                  >
                    <InputLabel id="grade-label">Grado*</InputLabel>
                    <Select
                      labelId="grade-label"
                      id="grade"
                      name="grade"
                      value={values.grade || ''}
                      onChange={(event) => {
                        handleChange(event);
                        setSelectedGrade(event.target.value);
                      }}
                      onBlur={handleBlur}
                      label="Grado*"
                      startAdornment={
                        <InputAdornment position="start">
                          <IconSchool stroke={1.5} size="1.3rem" />
                        </InputAdornment>
                      }
                    >
                      {gradeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.grade && errors.grade && (
                      <FormHelperText error>
                        {errors.grade}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
            </MainCard>
            <MainCard className={'form-data flex-column'} title={'Materias'}>

              {/* Selección de Materias */}
              <Grid item xs={12}>

                    <>
                      {renderCourseOptions()}
                      {errors.courseInscriptions && (
                        <FormHelperText error>{errors.courseInscriptions}</FormHelperText>
                      )}
                   </>
                
              </Grid>

            </MainCard>


            <MainCard className={'form-data flex-column'}>
              {errors.submit && (
                <FormHelperText error>{errors.submit}</FormHelperText>
              )}
              <Button variant='outlined' type='submit' color='primary' disabled={isSubmitting}>
                Guardar
              </Button>
            </MainCard>
          </form>
        )}
      </Formik>
    </div>
  );
};

interface Props {
  className?: string;
  title: string;
  initialValues: FormValues;
  onSubmit: OnSubmit;
  isUpdate?: boolean;
}

export type FormValues = {
  studentId: number;
  schoolYearId: number;
  grade: string;
  courseInscriptions?: { courseSchoolYearId: number }[];
  submit?: string | null;
}

export type OnSubmit = (
  values: FormValues,
  helpers: FormikHelpers<FormValues>
) => void | Promise<any>

export default styled(InscriptionForm)`
  width: 100%;
  display: flex;
  flex-direction: column;

  .form-data {
    margin-bottom: 1rem;
  }

  .autocomplete-control {
    .MuiAutocomplete-inputRoot {
      padding-left: 9px;
    }
  }



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