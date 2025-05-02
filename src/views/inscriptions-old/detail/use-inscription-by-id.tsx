import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from 'store';
import { setIsLoading, setErrorMessage } from 'store/customizationSlice';
import { useInscriptions } from '../hooks/use-inscriptions';
import { InscriptionDto } from '../../../core/inscriptions/types';

export default function useInscriptionById(id: number | null) {
  const dispatch = useAppDispatch();
  const [inscription, setInscription] = useState<InscriptionDto | null>(null);
  const { getInscription } = useInscriptions();

  const fetchInscription = useCallback(
    async (id: number) => {
      try {
        dispatch(setIsLoading(true));
        const response = await getInscription(id);
        setInscription(response);
      } catch (error: any) {
        dispatch(setErrorMessage(error.message || 'Error al obtener la inscripción'));
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, getInscription]
  );

  useEffect(() => {
    if (id) fetchInscription(id);
  }, [fetchInscription, id]);

  return inscription;
} 