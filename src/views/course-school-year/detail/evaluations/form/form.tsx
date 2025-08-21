import { FunctionComponent, useCallback, useMemo } from 'react';
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
  isSubmitting = false,
  courtsOptions
}) => {
  // Esquema de validación de Yup
  const validationSchema = useMemo(() => Yup.object().shape({
    name: Yup.string()
      .required('El nombre es requerido')
      .max(100, 'El nombre no puede exceder los 100 caracteres'),
    percentage: Yup.number()
      .required('El porcentaje es requerido')
      .min(1, 'El porcentaje debe ser al menos 1')
      .max(100, 'El porcentaje no puede ser mayor a 100'),
    type: Yup.string()
      .required('El tipo de evaluación es requerido'),
    schoolCourtId: courtsOptions.length > 0 
      ? Yup.number().required('El corte escolar es requerido')
      : Yup.number().nullable(),
    courseSchoolYearId: Yup.number()
      .required('El curso-año escolar es requerido')
  }), [courtsOptions.length]);

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

            {
              JSON.stringify(values)
            }
            {/* Nombre de la evaluación */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                data-lpignore="true"
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

            {/* Corte escolar - Solo mostrar si hay opciones disponibles */}
            {courtsOptions.length > 0 && (
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={touched.schoolCourtId && Boolean(errors.schoolCourtId)}
                >
                  <InputLabel id="schoolCourtId-label">Corte escolar *</InputLabel>
                  <Select
                    labelId="schoolCourtId-label"
                    id="schoolCourtId"
                    data-lpignore="true"
                    name="schoolCourtId"
                    value={values.schoolCourtId || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Corte escolar *"
                    disabled={isSubmitting || formikSubmitting}
                  >
                    {courtsOptions.map((option) => (
                      <MenuItem key={option.value || 0} value={option.value || 0}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.schoolCourtId && errors.schoolCourtId && (
                    <FormHelperText>{errors.schoolCourtId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            )}

            {/* Tipo de evaluación */}
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                error={touched.type && Boolean(errors.type)}
              >
                <InputLabel data-lpignore="true" id="type-label">Tipo de evaluación *</InputLabel>
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
                  <MenuItem value={EvaluationType.TASK}>Tarea</MenuItem>
                  <MenuItem value={EvaluationType.EXAM}>Examen</MenuItem>
                  <MenuItem value={EvaluationType.PROJECT}>Proyecto</MenuItem>
                  <MenuItem value={EvaluationType.HOMEWORK}>Asignación</MenuItem>
                  <MenuItem value={EvaluationType.WORKSHOP}>Taller</MenuItem>
                  <MenuItem value={EvaluationType.PRACTICE}>Práctica</MenuItem>
                  <MenuItem value={EvaluationType.LAPSE_EXAM}>Examen de Lapso</MenuItem>
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
                data-lpignore="true"
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
              <TextField
                fullWidth
                id="projectedDate"
                label="Fecha proyectada"
                type="date"
                value={values.projectedDate ? values.projectedDate.split('T')[0] : ''}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.projectedDate && Boolean(errors.projectedDate)}
                helperText={touched.projectedDate && errors.projectedDate}
                disabled={isSubmitting || formikSubmitting}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default EvaluationForm;
