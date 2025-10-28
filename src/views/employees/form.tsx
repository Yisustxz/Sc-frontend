import { FunctionComponent, useMemo, useState } from 'react'
import * as Yup from 'yup'
import { Formik, FormikHelpers } from 'formik'
// material-ui
import MainCard from 'components/cards/MainCard'
import {
  Button,
  FormControl,
  FormHelperText,
  TextField,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material'
import styled from 'styled-components'
import { TypeEmployee } from 'core/employees/types'
import { UserTeacher } from 'core/users/types'
import OnlineAutocomplete from 'components/OnlineAutocomplete'
import useGetTeacherUsers from 'services/hooks/use-get-teacher-users'

const TEACHER_SEARCH_LIMIT = 10

const Form: FunctionComponent<Props> = ({
  className,
  title,
  onSubmit,
  initialValues,
  isUpdate
}) => {
  const isCreated = !isUpdate

  // Estado para el selector de usuarios teachers
  const [teacherSearchTerm, setTeacherSearchTerm] = useState<string | null>(null);
  const forceTeacherIds = useMemo(() => initialValues.userId ? [initialValues.userId] : [], [initialValues.userId]);

  console.log('Tombs Scare', forceTeacherIds, initialValues.userId);

  const { data: teacherUsers = [], isLoading: isLoadingTeachers } = 
    useGetTeacherUsers(forceTeacherIds, teacherSearchTerm, TEACHER_SEARCH_LIMIT);

  // Funciones para manejar la selección de teacher
  const handleTeacherChange = (teacher: UserTeacher | null, setFieldValue: any) => {
    if (teacher) {
      setFieldValue('userId', teacher.id);
    } else {
      setFieldValue('userId', null);
    }
  };

  const getTeacherOptionLabel = (teacher: UserTeacher): string => {
    return `${teacher.name} (${teacher.email})`;
  };

  const extraValidations: any = isCreated
    ? {
          dni: Yup.string()
      .max(8, 'La cédula del Empleado no puede tener más de 8 numeros')
      .required('La cedula del Empleado es requerida'),
    }
    : {}

  return (
    <div className={className}>
      <Formik
        validateOnChange={true}
        validateOnBlur={false}
        validateOnMount={isUpdate}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          ...extraValidations,
          name: Yup.string()
            .max(
              30,
              'El nombre del Empleado no puede tener más de 30 caracteres'
            )
            .required('El nombre del Empleado es requerido'),
          lastName: Yup.string()
            .max(
              30,
              'El apellido del Empleado no puede tener más de 30 caracteres'
            )
            .required('El apellido del Empleado es requerido'),
          phone: Yup.string()
            .max(
              11,
              'El teléfono del Empleado no puede tener más de 11 caracteres'
            )
            .required('El teléfono del Empleado es requerido'),
          direction: Yup.string().required(
            'La dirección del Empleado es requerido'
          ),
          employeeType: Yup.string().required(
            'El tipo de empleado es requerido'
          ),
          userId: Yup.number()
            .nullable()
            .notRequired()
        })}
        onSubmit={onSubmit as any}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
          setFieldValue
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <MainCard className={'form-data'} title={title}>
              <div className='form-grid'>
                {isCreated ? (
                  <FormControl className='field-form' fullWidth>
                    <TextField
                      id='dni'
                      label='Cédula'
                      variant='outlined'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.dni}
                      helperText={touched.dni ? errors.dni : ''}
                      error={touched.dni && !!errors.dni}
                      name='dni'
                      inputProps={{
                        maxLength: 8
                      }}
                    />
                  </FormControl>
                ) : (
                  <FormControl className='field-form' fullWidth>
                    <TextField
                      id='id'
                      label='ID'
                      variant='outlined'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.dni}
                      helperText={touched.dni ? errors.dni : ''}
                      error={touched.dni && !!errors.dni}
                      name='dni'
                      inputProps={{
                        maxLength: 8
                      }}
                    />
                  </FormControl>
                )}
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='name'
                    label='Nombre'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    helperText={touched.name ? errors.name : ''}
                    error={touched.name && !!errors.name}
                    name='name'
                    inputProps={{ maxLength: 30 }}
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='lastName'
                    label='Apellido'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    helperText={touched.lastName ? errors.lastName : ''}
                    error={touched.lastName && !!errors.lastName}
                    name='lastName'
                    inputProps={{ maxLength: 30 }}
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='phone'
                    label='Teléfono'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                    helperText={touched.phone ? errors.phone : ''}
                    error={touched.phone && !!errors.phone}
                    name='phone'
                    inputProps={{ maxLength: 11 }}
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='direction'
                    label='Dirección'
                    variant='outlined'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.direction}
                    helperText={touched.direction ? errors.direction : ''}
                    error={touched.direction && !!errors.direction}
                    name='direction'
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <TextField
                    id='birthDate'
                    label='Fecha de Nacimiento'
                    variant='outlined'
                    type='date'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.birthDate}
                    helperText={touched.birthDate ? errors.birthDate : ''}
                    error={touched.birthDate && !!errors.birthDate}
                    name='birthDate'
                    InputLabelProps={{
                      shrink: true
                    }}
                    inputProps={{
                      max: new Date().toISOString().split('T')[0]
                    }}
                  />
                </FormControl>
                <FormControl className='field-form' fullWidth>
                  <InputLabel id='role-label'>Seleccionar Rol</InputLabel>
                  <Select
                    id='role'
                    name='employeeType'
                    value={values.employeeType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.employeeType && !!errors.employeeType}
                  >
                    {Object.values(TypeEmployee).map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.employeeType && errors.employeeType && (
                    <FormHelperText error>{errors.employeeType}</FormHelperText>
                  )}
                </FormControl>
                {/* Selector de Usuario (solo para profesores) */}
                {values.employeeType === TypeEmployee.Professor && (
                  <FormControl className='field-form' fullWidth>
                    <OnlineAutocomplete
                      showSelection={false}
                      options={teacherUsers}
                      onChange={(teacher: UserTeacher | null) => handleTeacherChange(teacher, setFieldValue)}
                      getOptionLabel={getTeacherOptionLabel}
                      label="Usuario Asignado (Opcional)"
                      required={false}
                      loading={isLoadingTeachers}
                      searchFn={setTeacherSearchTerm}
                      error={touched.userId && errors.userId ? String(errors.userId) : undefined}
                      noOptionsText="No se encontraron usuarios teachers"
                      loadingText="Buscando usuarios..."
                      originalValue={initialValues.userId}
                      currentValue={values.userId}
                    />
                    {values.userId && (
                      <FormHelperText>
                        <Button 
                          size="small" 
                          variant="text" 
                          color="secondary"
                          onClick={() => handleTeacherChange(null, setFieldValue)}
                          sx={{ textTransform: 'none', fontSize: '0.75rem', padding: '2px 4px', minWidth: 'auto' }}
                        >
                          ✕ Quitar usuario asignado
                        </Button>
                      </FormHelperText>
                    )}
                    { errors.userId && (
                    <FormHelperText error>{errors.userId}</FormHelperText>
                  )}
                  </FormControl>
                )}
              </div>
            </MainCard>

            <MainCard className={'form-data flex-column'}>
              {errors.submit && (
                <FormHelperText error>{errors.submit}</FormHelperText>
              )}
              <Button variant='outlined' type='submit' color='primary'>
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
  dni: string
  name: string
  lastName: string
  phone: string
  direction: string
  birthDate: string
  employeeType: TypeEmployee
  userId?: number | null
  submit: string | null
}

export type OnSubmit = (
  values: FormValues,
  helpers: FormikHelpers<FormValues>
) => void | Promise<any>

export default styled(Form)`
  display: flex;
  flex-direction: column;

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px; /* Espacio entre columnas */
  }

  .form-grid .field-form {
    margin: 0; /* Remover margin en grid, usar gap del grid */
  }

  @media screen and (max-width: 768px) {
    /* Media query para dispositivos móviles */
    .form-grid {
      grid-template-columns: 1fr; /* Una sola columna */
      gap: 12px; /* Espacio entre filas en móvil */
    }
  }

  .form-data {
    margin-top: 16px;
  }

  .field-form {
    margin: 12px 0px;
  }
`
