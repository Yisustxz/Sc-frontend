import { FunctionComponent, useCallback } from 'react';
// material-ui
import styled from 'styled-components';
import { useNavigate } from 'react-router';
//own
import BackendError from 'exceptions/backend-error';
import { useAppDispatch } from '../../../store/index';
import { setIsLoading, setSuccessMessage, setErrorMessage } from 'store/customizationSlice';
import Form, { FormValues } from '../form';
import editCourse from 'services/courses/edit-course';
import useCourseById from './use-course-by-id';
import useCourseId from './use-course-id';
import { FormikHelpers } from 'formik';
import BreadcrumbsNav from 'components/BreadcrumbsNav';

const EditCourse: FunctionComponent<Props> = ({className}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const courseId = useCourseId();
  const course = useCourseById(courseId);

  const onSubmit = useCallback(async (values: any, { setErrors, setStatus, setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      dispatch(setIsLoading(true));
      setErrors({});
      setStatus({});
      setSubmitting(true);
      await editCourse(courseId!, values);
      navigate('/courses');
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
  }, [courseId, navigate, dispatch]);

  const breadcrumbsItems = [
    {
      label: 'Asignaturas',
      path: '/courses'
    },
    {
      label: 'Editar Asignatura'
    }
  ];

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />
      
      {
        course && (
          <Form
            isUpdate={true}
            initialValues={{
              name: course.name,
              grade: course.grade,
              publicName: course.publicName || '',
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

export default styled(EditCourse)`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
`;

