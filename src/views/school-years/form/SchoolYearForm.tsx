import { FunctionComponent } from 'react';
import { 
  FormControl, 
  FormHelperText, 
  TextField,
} from '@mui/material';
import { FormikErrors, FormikTouched } from 'formik';
import styled from 'styled-components';
import { CalendarToday } from '@mui/icons-material';
import { FormValues } from './types';

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
    <div className={className}>
      <div className='form-grid'>
        <FormControl className='field-form' fullWidth>
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
            InputProps={{
              className: 'input-field'
            }}
          />
        </FormControl>

        <FormControl className='field-form' fullWidth>
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
              className: 'input-field',
              startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
            }}
          />
        </FormControl>

        <FormControl className='field-form' fullWidth>
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
              className: 'input-field',
              startAdornment: <CalendarToday fontSize="small" className="calendar-icon" />
            }}
          />
        </FormControl>
      </div>
    </div>
  );
};

export default styled(SchoolYearForm)`
  width: 100%;

  .form-data {
    margin-top: 16px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px; /* Espacio entre columnas */
    margin-bottom: 24px;
  }

  .field-form {
    margin-bottom: 8px;
  }

  .calendar-icon {
    margin-right: 8px;
    color: rgba(0, 0, 0, 0.54);
  }

  .input-field {
    background-color: #f8f9fa;
  }

  /* Responsive */
  @media (min-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (min-width: 1024px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
`;




  