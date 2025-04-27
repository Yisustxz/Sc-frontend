import { useCallback, useEffect, useState, useRef } from 'react';
import { debounce } from 'lodash';
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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [representatives, setRepresentatives] = useState<Representatives[]>([]);
  const [paginate, setPaginate] = useState<PaginateData>({
    totalItems: 0,
    page: 1,
    perPage: 5,
    totalPages: 0,
  });

  const fetchRepresentatives = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const trimmedSearch = searchTerm.trim();
      const response = await getPaginate({ 
        page, 
        size: paginate.perPage,
        searchTerm: trimmedSearch ?? ''
      });
      setRepresentatives(response.items);
      setPaginate(response.paginate);
    } catch (error) {
      if (error instanceof BackendError)
        dispatch(setErrorMessage(error.getMessage()));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch, page, paginate.perPage, searchTerm]);

  const setSearchTermDebounced = useRef(
    debounce((value: string) => {
      setSearchTerm(value);
      setPage(1);
    }, 500)
  ).current;

  // Este efecto se ejecuta cuando cambia la página o el término de búsqueda
  useEffect(() => {
    fetchRepresentatives();
  }, [fetchRepresentatives]);

  return { 
    representatives, 
    paginate, 
    setPage, 
    fetchRepresentatives,
    searchTerm,
    setSearchTerm: setSearchTermDebounced
  };
}
