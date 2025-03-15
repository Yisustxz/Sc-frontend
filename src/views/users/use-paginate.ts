import { useCallback, useEffect, useState } from 'react';
// Own
import { User } from 'core/users/types';
import getPaginate from 'services/users/get-paginate';
import { PaginateData } from 'services/types';
import { useAppDispatch } from 'store';
import { setIsLoading, setErrorMessage } from 'store/customizationSlice';
import BackendError from 'exceptions/backend-error';

export default function usePaginate() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [paginate, setPaginate] = useState<PaginateData>({
    total: 0,
    page: 1,
    perPage: 5,
    pages: 0,
  });

  const fetchUsers = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const response = await getPaginate({ page, size: paginate.perPage });
      setUsers(response.items);
      setPaginate(response.paginate);
    } catch (error) {
      if (error instanceof BackendError)
        dispatch(setErrorMessage(error.getMessage()));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch, page, paginate.perPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, paginate, setPage, fetchUsers };
}
