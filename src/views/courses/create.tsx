import { FunctionComponent, useCallback } from 'react';
// material-ui
import styled from 'styled-components';
import BackendError from 'exceptions/backend-error';
import createCourse from 'services/courses/create-course';
import { useNavigate } from 'react-router';
import { setErrorMessage, setIsLoading, setSuccessMessage } from 'store/customizationSlice';
import { useAppDispatch } from '../../store/index';
import Form, { FormValues } from './form';
import { FormikHelpers } from 'formik';
import BreadcrumbsNav from 'components/BreadcrumbsNav';

const CreateCourse: FunctionComponent<Props> = ({className}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = useCallback(async (values: any, { setErrors, setStatus, setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      dispatch(setIsLoading(true));
      setErrors({});
      setStatus({});
      setSubmitting(true);
      await createCourse(values);
      navigate('/courses');
      dispatch(setSuccessMessage(`Asignatura ${values.name} creada correctamente`));
    } catch (error) {
      if (error instanceof BackendError) {
        setErrors({
          ...error.getFieldErrorsMessages(),
          submit: error.getMessage()
        });
        dispatch(setErrorMessage(error.getMessage()));
      }
      setStatus({ success: 'false'});
    } finally {
      dispatch(setIsLoading(false));
      setSubmitting(false);
    }
  }, [dispatch, navigate]);

  const breadcrumbsItems = [
    {
      label: 'Asignaturas',
      path: '/courses'
    },
    {
      label: 'Crear Asignatura'
    }
  ];

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />

      <Form
        initialValues={{
          name: '',
          grade: 0,
          submit: null
        }}
        title={'Crear asignatura'}
        onSubmit={onSubmit}
      />
    </div>
  );
};

interface Props {
  className?: string;
}

export default styled(CreateCourse)`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
`;
