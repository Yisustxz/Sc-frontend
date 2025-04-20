import { FunctionComponent, useRef } from 'react';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Box, Button, CircularProgress, FormHelperText, Grid } from '@mui/material';
import MainCard from 'components/cards/MainCard';
import SchoolYearForm from './SchoolYearForm';
import LapsesCrud from './lapses/lapses-crud';
import { FormValues, SchoolLapseForm } from './types';
import type { OnSubmit } from './types';

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
  
  // Esta función se crea una sola vez durante el ciclo de vida del componente
  const handleLapsesChange = (lapses: SchoolLapseForm[]) => {
    if (formRef.current) {
      formRef.current.setFieldValue('lapses', lapses);
    }
  };
  
  return (
    <div className={className}>
      <Formik
        validateOnChange={true}
        validateOnBlur={false}
        validateOnMount={false}
        initialValues={initialValues}
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
          )
        })}
        onSubmit={onSubmit}
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
                />
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

  .lapses-card {
    height: 100%;
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


