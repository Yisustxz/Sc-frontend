import { useCallback, useEffect, useState } from 'react';
// material-ui
import BackendError from 'exceptions/backend-error';
import { setIsLoading, setErrorMessage } from 'store/customizationSlice';
import { useAppDispatch } from '../../../store/index';
import { Course } from 'core/courses/types';
import getCourse from 'services/courses/get-course';

export default function useCourseById(courseId: string | null) {
  const dispatch = useAppDispatch();
  const [course, setCourse] = useState<Course | null>(null);

  const fetchCourse = useCallback(async (courseId: string) => {
    try {
      dispatch(setIsLoading(true));
      const response = await getCourse(courseId);
      setCourse(response);
    } catch (error) {
      if (error instanceof BackendError)
        dispatch(setErrorMessage(error.getMessage()));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (courseId) fetchCourse(courseId);
  }, [fetchCourse, courseId]);

  return course;
};
