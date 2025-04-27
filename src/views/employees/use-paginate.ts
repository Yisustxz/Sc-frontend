import { useCallback, useEffect, useState, useRef } from 'react';
import { debounce } from 'lodash';
// Own
import { Employees, TypeEmployee } from 'core/employees/types';
import getPaginate from 'services/employees/get-paginate';
import { PaginateData } from 'services/types';
import { useAppDispatch } from 'store';
import { setIsLoading, setErrorMessage } from 'store/customizationSlice';
import BackendError from 'exceptions/backend-error';

export default function usePaginate() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [employeeType, setEmployeeType] = useState<string>('');
  const [employees, setEmployees] = useState<Employees[]>([]);
  const [paginate, setPaginate] = useState<PaginateData>({
    totalItems: 0,
    page: 1,
    perPage: 5,
    totalPages: 0,
  });

  const fetchEmployees = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const trimmedSearch = searchTerm.trim();
      const response = await getPaginate({ 
        page, 
        size: paginate.perPage,
        searchTerm: trimmedSearch ?? '',
        employeeType: employeeType ?? ''
      });
      setEmployees(response.items);
      setPaginate(response.paginate);
    } catch (error) {
      if (error instanceof BackendError)
        dispatch(setErrorMessage(error.getMessage()));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch, page, paginate.perPage, searchTerm, employeeType]);

  const setSearchTermDebounced = useRef(
    debounce((value: string) => {
      setSearchTerm(value);
      setPage(1);
    }, 500)
  ).current;

  // Este efecto se ejecuta cuando cambia la página, el término de búsqueda o el tipo de empleado
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleEmployeeTypeChange = useCallback((value: string) => {
    setEmployeeType(value);
    setPage(1);
  }, []);

  return { 
    employees, 
    paginate, 
    setPage, 
    fetchEmployees,
    searchTerm,
    setSearchTerm: setSearchTermDebounced,
    employeeType,
    setEmployeeType: handleEmployeeTypeChange
  };
}
