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
  InputAdornment
} from '@mui/material'
import styled from 'styled-components'
import { IconCalendar, IconSchool, IconUser } from '@tabler/icons'
import { gradeMapping, EducationLevels } from 'core/courses/use-education-levels'
import { StudentDto, SchoolYearDto } from 'core/inscriptions/types/index'
import useGetSchoolYears from 'services/hooks/use-get-school-years'
import useGetStudents from 'services/hooks/use-get-students'
import OnlineAutocomplete from 'components/OnlineAutocomplete'

const EMPTY_ARRAY_REF = [] as any[]
const LIMIT_ITEMS_STUDENTS = 15;

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

  // Referencias estables para IDs a forzar
  const studentsToForce = useMemo(() => {
    return initialValues?.studentId ? [initialValues.studentId] : []
  }, [initialValues?.studentId])

  const schoolYearsToForce = useMemo(() => {
    return initialValues?.schoolYearId ? [initialValues.schoolYearId] : []
  }, [initialValues?.schoolYearId])

  // Obtener datos
  const { data: students = [], isLoading: loadingStudents } = useGetStudents(
    studentsToForce,
    studentSearch,
    LIMIT_ITEMS_STUDENTS
  );
  const { data: schoolYears = [], isLoading: loadingSchoolYears } = useGetSchoolYears(
    schoolYearsToForce,
    schoolYearSearch
  );

  // Opciones de grado para el selector
  const gradeOptions = Object.values(EducationLevels)
    .filter(value => !isNaN(Number(value)))
    .map(grade => ({
      value: grade,
      label: gradeMapping[grade as EducationLevels] || `Grado ${grade}`
    }))
    .sort((a, b) => Number(a.value) - Number(b.value));

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
    } else if (formikRef.current) {
      formikRef.current.setFieldValue('schoolYearId', null);
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
      .required('El grado es requerido')
  });

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
                      onChange={handleChange}
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
`; 