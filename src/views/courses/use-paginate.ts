import { useCallback, useEffect, useState, useRef } from 'react';
import { debounce } from 'lodash';
// Own
import { Course } from 'core/courses/types';
import getPaginate from 'services/courses/get-paginate';
import { PaginateData } from 'services/types';
import { useAppDispatch } from 'store';
import { setIsLoading, setErrorMessage } from 'store/customizationSlice';
import BackendError from 'exceptions/backend-error';

export default function usePaginate() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [grade, setGrade] = useState<number | ''>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [paginate, setPaginate] = useState<PaginateData>({
    totalItems: 0,
    page: 1,
    perPage: 5,
    totalPages: 0,
  });

  const fetchCourses = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const trimmedSearch = searchTerm.trim();
      
      // Construir parámetros de la petición
      const params: any = { page, size: paginate.perPage };
      if (trimmedSearch) params.searchTerm = trimmedSearch;
      if (grade !== '') params.grade = grade;
      
      const response = await getPaginate(params);
      setCourses(response.items);
      setPaginate(response.paginate);
    } catch (error) {
      if (error instanceof BackendError)
        dispatch(setErrorMessage(error.getMessage()));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch, page, paginate.perPage, searchTerm, grade]);

  // Debounce para el campo de búsqueda
  const setSearchTermDebounced = useRef(
    debounce((value: string) => {
      setSearchTerm(value);
      setPage(1); // Resetear a la primera página al buscar
    }, 500)
  ).current;

  // Manejador para cambios en el filtro de grado
  const handleGradeChange = useCallback((value: number | '') => {
    setGrade(value);
    setPage(1); // Resetear a la primera página al cambiar el filtro
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { 
    courses, 
    paginate, 
    setPage, 
    fetchCourses,
    searchTerm,
    setSearchTerm: setSearchTermDebounced,
    grade,
    setGrade: handleGradeChange
  };
}
