import { FunctionComponent } from 'react';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Box, Button, CircularProgress } from '@mui/material';
import MainCard from 'components/cards/MainCard';
import SchoolYearForm from './SchoolYearForm';
import LapsesCrud from './lapses/lapses-crud';
import { FormValues, SchoolLapseForm } from '../form';

interface Props {
  className?: string;
  initialValues: FormValues;
  onSubmit: (values: FormValues, helpers: FormikHelpers<FormValues>) => void | Promise<any>;
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
              'La fecha de fin no puede ser anterior a la fecha de inicio'
            )
        })}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <MainCard className="form-data" title={title}>
              {/* Datos básicos del año escolar */}
              <SchoolYearForm
                values={values}
                errors={errors}
                touched={touched}
                handleBlur={handleBlur}
                handleChange={handleChange}
              />
              
              {/* Sección de lapsos */}
              <Box className="lapses-section">
                <LapsesCrud
                  lapses={values.lapses}
                  onChange={(lapses: SchoolLapseForm[]) => setFieldValue('lapses', lapses)}
                />
              </Box>

              {/* Botones de acción */}
              <Box className="form-actions">
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  endIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
                >
                  {isUpdate ? 'Actualizar' : 'Crear'}
                </Button>
              </Box>
            </MainCard>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default styled(SchoolYearFormContainer)`
  width: 100%;

  .form-data {
    margin-bottom: 24px;
  }

  .lapses-section {
    margin-top: 32px;
  }

  .form-actions {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
  }
`; 