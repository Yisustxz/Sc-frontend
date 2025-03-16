import { useCallback, useEffect, useState } from 'react';
// material-ui
import BackendError from 'exceptions/backend-error';
import { setIsLoading, setErrorMessage } from 'store/customizationSlice';
import { useAppDispatch } from '../../../store/index';
import { Subject } from 'core/subjects/types';
import getSubject from 'services/subjects/get-subject';

export default function useSubjectById(subjectId: string | null) {
  const dispatch = useAppDispatch();
  const [subject, setSubject] = useState<Subject | null>(null);

  const fetchSubject = useCallback(async (subjectId: string) => {
    try {
      dispatch(setIsLoading(true));
      const response = await getSubject(subjectId);
      setSubject(response);
    } catch (error) {
      if (error instanceof BackendError)
        dispatch(setErrorMessage(error.getMessage()));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (subjectId) fetchSubject(subjectId);
  }, [fetchSubject, subjectId]);

  return subject;
};
