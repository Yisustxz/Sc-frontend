import { FunctionComponent, useCallback } from 'react';
// material-ui
import MainCard from 'components/cards/MainCard';
import {  Typography } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
//own
import BackendError from 'exceptions/backend-error';
import { useAppDispatch } from '../../../store/index';
import { setIsLoading, setSuccessMessage, setErrorMessage } from 'store/customizationSlice';
import Form, { FormValues } from '../form';
import editUser from 'services/users/edit-user';
import useUserById from './use-user-by-id';
import useUserId from './use-user-id';
import { FormikHelpers } from 'formik';

const EditUser: FunctionComponent<Props> = ({className}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const id = useUserId();
  const user = useUserById(id);

  const onSubmit = useCallback(async (values: any, { setErrors, setStatus, setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      dispatch(setIsLoading(true));
      setErrors({});
      setStatus({});
      setSubmitting(true);
      await editUser(id!, values);
      navigate('/users');
      dispatch(setSuccessMessage(`Usuario ${values.name} editado correctamente`));
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
  }, [id, navigate, dispatch]);

  return (
    <div className={className}>
      <MainCard>
        <Typography variant="h3" component="h3">
          Usuarios
        </Typography>
      </MainCard>
      {
        user && (
          <Form
            isUpdate={true}
            initialValues={{
              name: user.name,
              email: user.email,
              role: user.role,
              password: '',
              submit: null
            }}
            title={'Editar usuario'}
            onSubmit={onSubmit}
          />
        )
      }
    </div>
  );
};

interface Props {
  className?: string;
}

export default styled(EditUser)`
  display: flex;
  flex-direction: column;

  .flex-column {
    display: flex;
    flex-direction: column;
  }

  .form-data {
    margin-top: 16px;
  }

  .form-header-card {
    width: 100%;
  }

  .form-header {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
`;

