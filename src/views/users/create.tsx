import { FunctionComponent, useCallback } from 'react';
// material-ui
import styled from 'styled-components';
import BackendError from 'exceptions/backend-error';
import createUser from 'services/users/create-user';
import { useNavigate } from 'react-router';
import { setErrorMessage, setIsLoading, setSuccessMessage } from 'store/customizationSlice';
import { useAppDispatch } from '../../store/index';
import Form, { FormValues } from './form';
import { FormikHelpers } from 'formik';
import BreadcrumbsNav from 'components/BreadcrumbsNav';

const CreateUser: FunctionComponent<Props> = ({className}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onSubmit = useCallback(async (values: any, { setErrors, setStatus, setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      dispatch(setIsLoading(true));
      setErrors({});
      setStatus({});
      setSubmitting(true);
      await createUser(values);
      navigate('/users');
      dispatch(setSuccessMessage(`Usuario ${values.name} creado correctamente`));
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
      label: 'Usuarios',
      path: '/users'
    },
    {
      label: 'Crear Usuario'
    }
  ];

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />

      <Form
        initialValues={{
          name: '',
          email: '',
          role: '',
          password: '',
          submit: null
        }}
        title={'Crear usuario'}
        onSubmit={onSubmit}
      />
    </div>
  );
};

interface Props {
  className?: string;
}

export default styled(CreateUser)`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
`;
