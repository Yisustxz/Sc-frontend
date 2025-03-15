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
import editSubject from 'services/subjects/edit-subject';
import useSubjectById from './use-subject-by-id';
import useSubjectId from './use-subject-id';
import { FormikHelpers } from 'formik';

const EditSubject: FunctionComponent<Props> = ({className}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const subjectId = useSubjectId();
  const subject = useSubjectById(subjectId);

  const onSubmit = useCallback(async (values: any, { setErrors, setStatus, setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      dispatch(setIsLoading(true));
      setErrors({});
      setStatus({});
      setSubmitting(true);
      await editSubject(subjectId!, values);
      navigate('/subjects');
      dispatch(setSuccessMessage(`Asignatura ${values.name} editada correctamente`));
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
  }, [subjectId, navigate, dispatch]);

  return (
    <div className={className}>
      <MainCard>
        <Typography variant="h3" component="h3">
          Asignaturas
        </Typography>
      </MainCard>
      {
        subject && (
          <Form
            isUpdate={true}
            initialValues={{
              id: subject.id,
              name: subject.name,
              grade: subject.grade,
              teacher: subject.teacher,
              submit: null
            }}
            title={'Editar asignatura'}
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

export default styled(EditSubject)`
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

