import { FunctionComponent, useRef, useState, useCallback, useMemo } from 'react';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Box, Button, CircularProgress, FormHelperText, Grid, Typography } from '@mui/material';
import MainCard from 'components/cards/MainCard';
import SchoolYearForm from './SchoolYearForm';
import LapsesCrud from './lapses/lapses-crud';
import CoursesCrud from './courses/courses-crud';
import { FormValues, SchoolLapseForm, SchoolCourseForm } from './types';
import type { OnSubmit } from './types';
import { IconCirclePlus } from '@tabler/icons';
import { mapBackendCoursesToFrontend, mapFrontendCoursesToBackend, getCoursesToDelete } from './courses/mapper';

interface Props {
  className?: string;
  initialValues: FormValues;
  onSubmit: OnSubmit;
  title: string;
  isUpdate?: boolean;
}

const SchoolYearFormContainer: FunctionComponent<Props> = ({
  className,
  initialValues,
  onSubmit,
  title,
  isUpdate = false
}) => {
  // Utilizamos una referencia para almacenar el formulario
  const formRef = useRef<FormikProps<FormValues>>(null);
  
  // Estado para controlar la apertura del modal de cursos
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Funciones para manejar el estado del modal
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  
  // Transformamos los valores iniciales si tienen formato backend
  const transformedInitialValues = useMemo(() => {
    const values = { ...initialValues };
    
    console.log("Valores iniciales recibidos:", values);
    
    // Verificamos si courseSchoolYears tiene formato backend
    if (values.courseSchoolYears?.length) {
      console.log("courseSchoolYears antes de transformar:", values.courseSchoolYears);
      
      // Verificar si algún elemento tiene la estructura del backend (con course o professor)
      // Usamos 'any' para evitar errores de TypeScript ya que estamos verificando propiedades
      // que no están en la interfaz SchoolCourseForm
      const hasBackendFormat = values.courseSchoolYears.some((item: any) => 
        item?.course || item?.professor || 
        ('course' in (item || {})) || ('professor' in (item || {}))
      );
      
      if (hasBackendFormat) {
        console.log("Detectado formato de backend, transformando...");
        values.courseSchoolYears = mapBackendCoursesToFrontend(values.courseSchoolYears as any);
        console.log("courseSchoolYears después de transformar:", values.courseSchoolYears);
      } else {
        console.log("No se detectó formato de backend, manteniendo valores originales");
      }
    }
    
    return values;
  }, [initialValues]);
  
  // Esta función se crea una sola vez durante el ciclo de vida del componente
  const handleLapsesChange = useCallback((lapses: SchoolLapseForm[]) => {
    if (formRef.current) {
      formRef.current.setFieldValue('lapses', lapses);
    }
  }, []);

  // Función para actualizar cursos
  const handleCoursesChange = useCallback((courses: SchoolCourseForm[]) => {
    if (formRef.current) {
      formRef.current.setFieldValue('courseSchoolYears', courses);
    }
  }, []);
  
  // Función personalizada para manejar el envío del formulario
  const handleSubmit = useCallback<OnSubmit>((values, helpers) => {
    // Crear una copia de los valores
    const submittingValues = { ...values };
    
    // Transformar los courseSchoolYears a formato backend
    if (submittingValues.courseSchoolYears?.length) {
      // Obtener los IDs de cursos a eliminar para enviarlos por separado si es necesario
      const courseIdsToDelete = getCoursesToDelete(submittingValues.courseSchoolYears);
      
      // Transformar los cursos al formato backend y asignarlos a una nueva propiedad
      // para evitar problemas de tipado
      const transformedCourses = mapFrontendCoursesToBackend(submittingValues.courseSchoolYears);
      
      // Usar 'as any' para evitar el error de tipos al asignar
      (submittingValues as any).courseSchoolYears = transformedCourses;
      
      // Añadir los IDs a eliminar si la API lo requiere
      if (courseIdsToDelete.length) {
        (submittingValues as any).courseSchoolYearsToDelete = courseIdsToDelete;
      }
    }
    
    // Llamar al onSubmit original con los valores transformados
    return onSubmit(submittingValues, helpers);
  }, [onSubmit]);
  
  return (
    <div className={className}>
      <Formik
        validateOnChange={true}
        validateOnBlur={false}
        validateOnMount={false}
        initialValues={transformedInitialValues}
        validationSchema={Yup.object().shape({
          code: Yup.string()
            .max(10, 'El código no puede tener más de 10 caracteres')
            .required('El código es requerido'),
          startDate: Yup.date().required('La fecha de inicio es requerida'),
          endDate: Yup.date()
            .required('La fecha de fin es requerida')
            .min(
              Yup.ref('startDate'),
              'La fecha de fin debe ser mayor o igual a la fecha de inicio'
            ),
          lapses: Yup.array().of(
            Yup.object().shape({
              startDate: Yup.string()
                .required('Debes establecer una fecha de inicio')
                .test('is-not-empty', 'Debes establecer una fecha de inicio', 
                  value => value !== null && value !== undefined && value !== ''),
              endDate: Yup.string()
                .required('Debes establecer una fecha de fin')
                .test('is-not-empty', 'Debes establecer una fecha de fin', 
                  value => value !== null && value !== undefined && value !== '')
                .test('is-after-start', 'La fecha de fin debe ser mayor o igual a la fecha de inicio',
                  function(value) {
                    // Si no hay fecha, no validamos la relación
                    if (!value || !this.parent.startDate) return true;
                    return new Date(value) >= new Date(this.parent.startDate);
                  }),
              schoolCourts: Yup.array().of(
                Yup.object().shape({
                  startDate: Yup.string()
                    .required('Debes establecer una fecha de inicio')
                    .test('is-not-empty', 'Debes establecer una fecha de inicio', 
                      value => value !== null && value !== undefined && value !== ''),
                  endDate: Yup.string()
                    .required('Debes establecer una fecha de fin')
                    .test('is-not-empty', 'Debes establecer una fecha de fin', 
                      value => value !== null && value !== undefined && value !== '')
                    .test('is-after-start', 'La fecha de fin debe ser mayor o igual a la fecha de inicio',
                      function(value) {
                        // Si no hay fecha, no validamos la relación
                        if (!value || !this.parent.startDate) return true;
                        return new Date(value) >= new Date(this.parent.startDate);
                      })
                }).test('not-deleted', 'No se validan los cortes eliminados', 
                  function(value) {
                    // No validamos fechas en los elementos marcados como eliminados
                    return !value || value.localDeleted || 
                      (value.startDate && value.endDate && new Date(value.endDate) >= new Date(value.startDate));
                  })
              )
            }).test('not-deleted', 'No se validan los lapsos eliminados', 
              function(value) {
                // No validamos fechas en los elementos marcados como eliminados
                return !value || value.localDeleted || 
                  (value.startDate && value.endDate && new Date(value.endDate) >= new Date(value.startDate));
              })
          ),
          courseSchoolYears: Yup.array().of(
            Yup.object().shape({
              courseId: Yup.string().required('Debes seleccionar una asignatura'),
              grade: Yup.string().required('Debes especificar un grado'),
              weeklyHours: Yup.number().min(0, 'Las horas semanales no pueden ser negativas')
            }).test('not-deleted', 'No se validan las asignaturas eliminadas', 
              function(value) {
                // No validamos los elementos marcados como eliminados
                return !value || value.localDeleted || (value.courseId && value.grade);
              })
          )
        })}
        onSubmit={handleSubmit}
        innerRef={formRef}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Primera fila: Información del año escolar y Lapsos */}
              <Grid item xs={12} md={4}>
                <MainCard className="form-data" title={title}>
                  <SchoolYearForm
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                  />
                </MainCard>
              </Grid>

              <Grid item xs={12} md={8}>
                <LapsesCrud
                  lapses={values.lapses}
                  onChange={handleLapsesChange}
                  formErrors={errors}
                  formTouched={touched}
                  isCreateMode={!isUpdate}
                />
              </Grid>

              {/* Segunda fila: Asignaturas (ancho completo) */}
              <Grid item xs={12}>
                <MainCard 
                  className="courses-card" 
                  title={'Asignaturas por grado'}
                  secondary={
                    values.courseSchoolYears.length === 0 ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<IconCirclePlus size={20} />}
                        onClick={openModal}
                      >
                        Añadir Asignatura
                      </Button>
                    ) : null
                  }
                >
                  <CoursesCrud
                    courses={values.courseSchoolYears}
                    onChange={handleCoursesChange}
                    errors={errors}
                    externalModalOpen={isModalOpen}
                    onExternalModalClose={closeModal}
                    onExternalModalOpen={openModal}
                    isCreateMode={!isUpdate}
                  />
                </MainCard>
              </Grid>
            </Grid>

            {/* Botones de acción */}
            <Grid item xs={12}>
              <MainCard className={'form-data flex-column'}>
                {errors.submit && (
                  <FormHelperText error>{errors.submit}</FormHelperText>
                )}
                <Button
                  variant='outlined'
                  type='submit'
                  color='primary'
                  disabled={isSubmitting}
                  className="guardar-button"
                  endIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
                >
                  {isUpdate ? 'Actualizar' : 'Guardar'}
                </Button>
              </MainCard>
            </Grid>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default styled(SchoolYearFormContainer)`
  display: flex;
  flex-direction: column;

  .form-data {
    margin-top: 16px;
  }

  .lapses-card, .courses-card {
    margin-top: 16px;
  }

  .lapses-section {
    margin-top: 16px;
  }

  .form-actions {
    margin-top: auto;
    padding-top: 24px;
    display: flex;
    justify-content: flex-end;
  }
  
  .guardar-button {
    margin-left: auto;
  }
`; 


