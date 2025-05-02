import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setErrorMessage } from 'store/customizationSlice';
import deleteInscriptionService from 'services/inscriptions/delete-inscription';

/**
 * Hook para manejar la eliminación de inscripciones
 * @returns Funciones y estados para eliminar inscripciones
 */
const useDeleteInscription = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteInscription = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await deleteInscriptionService(id);
      
      setSuccess(true);
      return true;
    } catch (error) {
      const errorMessage = 'Error al eliminar la inscripción';
      setError(errorMessage);
      dispatch(setErrorMessage(errorMessage));
      console.error('Error al eliminar inscripción:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    deleteInscription,
    loading,
    error,
    success
  };
};

export default useDeleteInscription; 