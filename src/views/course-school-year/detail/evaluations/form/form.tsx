import { FunctionComponent, useCallback } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import {
  LocalizationProvider,
  DatePicker
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { EvaluationFormProps, EvaluationFormData } from './types';
import { EvaluationType } from 'core/evaluations/types';

const EvaluationForm: FunctionComponent<EvaluationFormProps> = ({
  onSubmit,
  initialValues,
  onCancel,
  isSubmitting = false
}) => {
  // Esquema de validación de Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('El nombre es requerido')
      .max(100, 'El nombre no puede exceder los 100 caracteres'),
    percentage: Yup.number()
      .required('El porcentaje es requerido')
      .min(1, 'El porcentaje debe ser al menos 1')
      .max(100, 'El porcentaje no puede ser mayor a 100'),
    type: Yup.string()
      .required('El tipo de evaluación es requerido'),
    schoolCourtId: Yup.number()
      .required('El corte escolar es requerido'),
    courseSchoolYearId: Yup.number()
      .required('El curso-año escolar es requerido')
  });

  // Función de envío del formulario
  const handleSubmit = useCallback(async (
    values: EvaluationFormData,
    { setSubmitting }: FormikHelpers<EvaluationFormData>
  ) => {
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }, [onSubmit]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        isSubmitting: formikSubmitting
      }) => (
        <Form id="evaluation-form">
          <Grid container spacing={2}>
            {/* Nombre de la evaluación */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Nombre de la evaluación *"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                disabled={isSubmitting || formikSubmitting}
              />
            </Grid>

            {/* Tipo de evaluación */}
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                error={touched.type && Boolean(errors.type)}
              >
                <InputLabel id="type-label">Tipo de evaluación *</InputLabel>
                <Select
                  labelId="type-label"
                  id="type"
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Tipo de evaluación *"
                  disabled={isSubmitting || formikSubmitting}
                >
                  <MenuItem value={EvaluationType.Task}>Tarea</MenuItem>
                  <MenuItem value={EvaluationType.Exam}>Examen</MenuItem>
                  <MenuItem value={EvaluationType.Project}>Proyecto</MenuItem>
                  <MenuItem value={EvaluationType.Homework}>Asignación</MenuItem>
                  <MenuItem value={EvaluationType.Workshop}>Taller</MenuItem>
                  <MenuItem value={EvaluationType.Practice}>Práctica</MenuItem>
                  <MenuItem value={EvaluationType.LapseExam}>Examen de Lapso</MenuItem>
                </Select>
                {touched.type && errors.type && (
                  <FormHelperText>{errors.type}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Porcentaje */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="percentage"
                name="percentage"
                label="Porcentaje *"
                type="number"
                value={values.percentage}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.percentage && Boolean(errors.percentage)}
                helperText={touched.percentage && errors.percentage}
                disabled={isSubmitting || formikSubmitting}
                InputProps={{
                  endAdornment: '%',
                  inputProps: { min: 1, max: 100 }
                }}
              />
            </Grid>

            {/* Fecha Proyectada */}
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha proyectada"
                  value={values.projectedDate ? new Date(values.projectedDate) : null}
                  onChange={(date) => {
                    setFieldValue('projectedDate', date ? date.toISOString() : null);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: touched.projectedDate && Boolean(errors.projectedDate),
                      helperText: touched.projectedDate && errors.projectedDate
                    }
                  }}
                  disabled={isSubmitting || formikSubmitting}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default EvaluationForm;