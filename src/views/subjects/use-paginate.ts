import { useCallback, useEffect, useState } from 'react';
// Own
import { Subject } from 'core/subjects/types';
import getPaginate from 'services/subjects/get-paginate';
import { PaginateData } from 'services/types';
import { useAppDispatch } from 'store';
import { setIsLoading, setErrorMessage } from 'store/customizationSlice';
import BackendError from 'exceptions/backend-error';

export default function usePaginate() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [paginate, setPaginate] = useState<PaginateData>({
    total: 0,
    page: 1,
    perPage: 5,
    pages: 0,
  });

  const fetchSubjects = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const response = await getPaginate({ page, size: paginate.perPage });
      setSubjects(response.items);
      setPaginate(response.paginate);
    } catch (error) {
      if (error instanceof BackendError)
        dispatch(setErrorMessage(error.getMessage()));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch, page, paginate.perPage]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return { subjects, paginate, setPage, fetchSubjects };
}
