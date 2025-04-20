import { FunctionComponent } from 'react';
import { 
  FormControl, 
  FormHelperText, 
  TextField,
  Grid
} from '@mui/material';
import { FormikErrors, FormikTouched } from 'formik';
import styled from 'styled-components';
import { CalendarToday } from '@mui/icons-material';
import { FormValues } from '../form';

interface Props {
  className?: string;
  values: FormValues;
  errors: FormikErrors<FormValues>;
  touched: FormikTouched<FormValues>;
  handleBlur: (e: React.FocusEvent<any>) => void;
  handleChange: (e: React.ChangeEvent<any>) => void;
}

const SchoolYearForm: FunctionComponent<Props> = ({
  className,
  values,
  errors,
  touched,
  handleBlur,
  handleChange
}) => {
  return (
    <Grid container spacing={3} className={className}>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <TextField
            id="code"
            name="code"
            label="Código"
            variant="outlined"
            value={values.code}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.code && Boolean(errors.code)}
            helperText={touched.code && errors.code}
            inputProps={{ maxLength: 10 }}
            placeholder="Ej: 2023-2024"
          />
        </FormControl>
      </Grid>

      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <TextField
            id="startDate"
            name="startDate"
            label="Fecha de Inicio"
            type="date"
            variant="outlined"
            value={values.startDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.startDate && Boolean(errors.startDate)}
            helperText={touched.startDate && errors.startDate}
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
            }}
          />
        </FormControl>
      </Grid>

      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <TextField
            id="endDate"
            name="endDate"
            label="Fecha de Fin"
            type="date"
            variant="outlined"
            value={values.endDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.endDate && Boolean(errors.endDate)}
            helperText={touched.endDate && errors.endDate}
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
            }}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default styled(SchoolYearForm)`
  margin-bottom: 24px;

  .calendar-icon {
    margin-right: 8px;
    color: rgba(0, 0, 0, 0.54);
  }
`; 