import { useCallback, useEffect, useState } from 'react';
// material-ui
import BackendError from 'exceptions/backend-error';
import { setIsLoading, setErrorMessage } from 'store/customizationSlice';
import { useAppDispatch } from '../../../store/index';
import { User } from 'core/users/types';
import getUser from 'services/users/get-user';

export default function useUserByDni(userDni: string | null) {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async (userDni: string) => {
    try {
      dispatch(setIsLoading(true));
      const response = await getUser(userDni);
      setUser(response);
    } catch (error) {
      if (error instanceof BackendError)
        dispatch(setErrorMessage(error.getMessage()));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (userDni) fetchUser(userDni);
  }, [fetchUser, userDni]);

  return user;
};
