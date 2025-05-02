import { FunctionComponent, useState, useCallback, useRef, useEffect, useMemo } from 'react'
import * as Yup from 'yup'
import { Formik, FormikHelpers, FormikProps } from 'formik'
// material-ui
import MainCard from 'components/cards/MainCard'
import {
  Button,
  FormControl,
  FormHelperText,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Autocomplete,
  InputAdornment,
} from '@mui/material'
import styled from 'styled-components'
import OnlineAutocomplete from 'components/OnlineAutocomplete'
import { gradeMapping, EducationLevels } from 'core/courses/use-education-levels'
import { CreateCourseSchoolYearPayload } from 'core/course-school-year/types'
import useGetSchoolYears from 'services/hooks/use-get-school-years'
import useGetCourses from 'services/hooks/use-get-courses'
import useGetEmployees from 'services/hooks/use-get-employees'
import { TypeEmployee, Employees } from 'core/employees/types'
import { IconCalendar, IconBook } from '@tabler/icons'
import { SchoolYearSelect } from 'core/school-year/types'

// Tipos
interface SchoolYear {
  id: number;
  code: string;
}

interface Course {
  id: number;
  name: string;
}

// Constantes
const EMPTY_ARRAY_REF: any[] = [];
const PROFESSOR_SEARCH_LIMIT = 10;
const COURSE_SEARCH_LIMIT = 10;

const Form: FunctionComponent<Props> = ({
  className,
  title,
  onSubmit,
  initialValues,
  isUpdate
}) => {
  const [professorSearchTerm, setProfessorSearchTerm] = useState("");
  const [schoolYearSearchTerm, setSchoolYearSearchTerm] = useState("");
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const formikRef = useRef<FormikProps<FormValues>>(null);

  // Forzar carga de profesor inicial si hay ID
  const forceItemsIds = useMemo(() => {
    return initialValues.professorId ? [initialValues.professorId] : [];
  }, [initialValues.professorId]);

  // Forzar carga de curso inicial si hay ID
  const forceCourseIds = useMemo(() => {
    return initialValues.courseId ? [initialValues.courseId] : [];
  }, [initialValues.courseId]);
  
  // Forzar carga de año escolar inicial si hay ID
  const forceSchoolYearIds = useMemo(() => {
    return initialValues.schoolYearId ? [initialValues.schoolYearId] : [];
  }, [initialValues.schoolYearId]);

  // Usar hooks para obtener datos
  const { data: schoolYears = [], isLoading: isLoadingSchoolYears } = useGetSchoolYears(forceSchoolYearIds, schoolYearSearchTerm);
  const { data: courses = [], isLoading: isLoadingCourses } = useGetCourses(forceCourseIds, courseSearchTerm, COURSE_SEARCH_LIMIT, null);
  const { 
    data: professors = [], 
    isLoading: isLoadingProfessors 
  } = useGetEmployees(
    forceItemsIds, 
    professorSearchTerm || null, 
    PROFESSOR_SEARCH_LIMIT, 
    TypeEmployee.Professor
  );

  // Manejar selección de profesor
  const handleProfessorChange = useCallback((newValue: Employees | null) => {
    if (formikRef.current) {
      formikRef.current.setFieldValue("professorId", newValue ? newValue.id : null);
    }
  }, []);

  // Obtener etiqueta para mostrar en el autocompletado de profesores
  const getProfessorOptionLabel = useCallback((option: Employees) => {
    return `${option.name || ''} ${option.lastName || ''}`;
  }, []);
  
  // Manejar selección de año escolar
  const handleSchoolYearChange = useCallback((newValue: SchoolYearSelect | null) => {
    if (formikRef.current) {
      formikRef.current.setFieldValue("schoolYearId", newValue ? newValue.id : null);
    }
  }, []);
  
  // Obtener etiqueta para mostrar en el autocompletado de años escolares
  const getSchoolYearOptionLabel = useCallback((option: SchoolYearSelect) => {
    return option.code;
  }, []);
  
  // Manejar selección de curso
  const handleCourseChange = useCallback((newValue: Course | null) => {
    if (formikRef.current) {
      formikRef.current.setFieldValue("courseId", newValue ? newValue.id : null);
    }
  }, []);
  
  // Obtener etiqueta para mostrar en el autocompletado de cursos
  const getCourseOptionLabel = useCallback((option: Course) => {
    return option.name;
  }, []);

  // Definir validaciones adicionales dependiendo si es crear o actualizar
  const extraValidations: any = isUpdate
    ? {}
    : {
        courseId: Yup.number()
          .required('La asignatura es requerida'),
        schoolYearId: Yup.number()
          .required('El año escolar es requerido'),
      };

  return (
    <div className={className}>
      <Formik
        validateOnChange={true}
        validateOnBlur={false}
        validateOnMount={false}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          ...extraValidations,
          grade: Yup.number()
            .required('El grado es requerido'),
          weeklyHours: Yup.number()
            .nullable()
            .min(0, 'Las horas semanales no pueden ser negativas'),
          professorId: Yup.number()
            .nullable(),
        })}
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
            <MainCard className={'form-data'} title={title}>
              <Grid container spacing={2}>
                {/* Año Escolar */}
                <Grid item xs={12} md={6}>
                  <OnlineAutocomplete
                    showSelection={false}
                    options={Array.isArray(schoolYears) ? schoolYears : []}
                    onChange={handleSchoolYearChange}
                    getOptionLabel={getSchoolYearOptionLabel}
                    label="Año Escolar"
                    required={!isUpdate}
                    loading={isLoadingSchoolYears}
                    searchFn={setSchoolYearSearchTerm}
                    error={touched.schoolYearId && errors.schoolYearId ? String(errors.schoolYearId) : undefined}
                    noOptionsText="No se encontraron años escolares"
                    loadingText="Buscando años escolares..."
                    originalValue={initialValues.schoolYearId || null}
                    currentValue={values.schoolYearId || null}
                    startAdornment={<IconCalendar size="1.1rem" />}
                  />
                </Grid>

                {/* Asignatura */}
                <Grid item xs={12} md={6}>
                  <OnlineAutocomplete
                    showSelection={false}
                    options={Array.isArray(courses) ? courses : []}
                    onChange={handleCourseChange}
                    getOptionLabel={getCourseOptionLabel}
                    label="Asignatura"
                    required={!isUpdate}
                    loading={isLoadingCourses}
                    searchFn={setCourseSearchTerm}
                    error={touched.courseId && errors.courseId ? String(errors.courseId) : undefined}
                    noOptionsText="No se encontraron asignaturas"
                    loadingText="Buscando asignaturas..."
                    originalValue={initialValues.courseId || null}
                    currentValue={values.courseId || null}
                    startAdornment={<IconBook size="1.1rem" />}
                  />
                </Grid>

                {/* Grado */}
                <Grid item xs={12} md={6}>
                  <FormControl 
                    fullWidth 
                    error={touched.grade && !!errors.grade}
                  >
                    <InputLabel>Grado *</InputLabel>
                    <Select
                      name="grade"
                      value={values.grade || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Grado *"
                    >
                      {Object.values(EducationLevels)
                        .filter(value => !isNaN(Number(value)))
                        .map(grade => (
                          <MenuItem key={grade} value={grade}>
                            {gradeMapping[grade as EducationLevels]}
                          </MenuItem>
                        ))}
                    </Select>
                    {touched.grade && errors.grade && (
                      <FormHelperText>{errors.grade as string}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Horas Semanales */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="weeklyHours"
                    label="Horas Semanales"
                    type="number"
                    value={values.weeklyHours || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.weeklyHours && !!errors.weeklyHours}
                    helperText={touched.weeklyHours && errors.weeklyHours as string}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>

                {/* Profesor */}
                <Grid item xs={12}>
                  <OnlineAutocomplete
                    showSelection={false}
                    options={Array.isArray(professors) ? professors : []}
                    onChange={handleProfessorChange}
                    getOptionLabel={getProfessorOptionLabel}
                    label="Profesor"
                    required={false}
                    loading={isLoadingProfessors}
                    searchFn={setProfessorSearchTerm}
                    error={touched.professorId && errors.professorId ? String(errors.professorId) : undefined}
                    noOptionsText="No se encontraron profesores"
                    loadingText="Buscando profesores..."
                    originalValue={initialValues.professorId || null}
                    currentValue={values.professorId || null}
                  />
                </Grid>
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
  )
}

interface Props {
  isUpdate?: boolean
  className?: string
  onSubmit: OnSubmit
  title: string
  initialValues: FormValues
}

export type FormValues = {
  grade: number;
  courseId?: number;
  schoolYearId?: number;
  weeklyHours?: number | null;
  professorId?: number | null;
  submit?: string | null;
}

export type OnSubmit = (
  values: FormValues,
  helpers: FormikHelpers<FormValues>
) => void | Promise<any>

export default styled(Form)`
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
` 