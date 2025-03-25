import { useCallback, useEffect, useState } from 'react';
// Own
import { Representatives } from 'core/representatives/types';
import getPaginate from 'services/representatives/get-paginate';
import { PaginateData } from 'services/types';
import { useAppDispatch } from 'store';
import { setIsLoading, setErrorMessage } from 'store/customizationSlice';
import BackendError from 'exceptions/backend-error';

export default function usePaginate() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [Representatives, setRepresentatives] = useState<Representatives[]>([]);
  const [paginate, setPaginate] = useState<PaginateData>({
    totalItems: 0,
    page: 1,
    perPage: 5,
    totalPages: 0,
  });

  const fetchRepresentatives = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const response = await getPaginate({ page, size: paginate.perPage });
      setRepresentatives(response.items);
      setPaginate(response.paginate);
    } catch (error) {
      if (error instanceof BackendError)
        dispatch(setErrorMessage(error.getMessage()));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch, page, paginate.perPage]);

  useEffect(() => {
    fetchRepresentatives();
  }, [fetchRepresentatives]);

  return { Representatives, paginate, setPage, fetchRepresentatives };
}
