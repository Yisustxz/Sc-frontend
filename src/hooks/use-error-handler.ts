import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setErrorMessage } from 'store/customizationSlice';
import BackendError from 'exceptions/backend-error';

export const useErrorHandler = () => {
  const dispatch = useDispatch();

  const handleError = useCallback((error: any) => {
    if (error instanceof BackendError) {
      dispatch(setErrorMessage(error.getMessage()));
    } else if (error?.response?.data?.message) {
      dispatch(setErrorMessage(error.response.data.message));
    } else {
      dispatch(setErrorMessage('Ha ocurrido un error inesperado.'));
    }
    console.error('Error caught:', error);
  }, [dispatch]);

  return { handleError };
}; 