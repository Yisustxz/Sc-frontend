import { useCallback, useEffect, useState, useRef } from 'react';
import { debounce } from 'lodash';
// Own
import { CourseSchoolYear } from 'core/course-school-year/types';
import getPaginate, { CourseSchoolYearPaginateParams } from 'services/course-school-year/get-paginate';
import { PaginateData } from 'services/types';
import { useAppDispatch } from 'store';
import { setIsLoading, setErrorMessage } from 'store/customizationSlice';
import BackendError from 'exceptions/backend-error';
import { Order } from 'common/constants/order';

export default function usePaginate() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [grade, setGrade] = useState<number | ''>('');
  const [schoolYearId, setSchoolYearId] = useState<number | ''>('');
  const [professorId, setProfessorId] = useState<number | ''>('');
  const [orderBy, setOrderBy] = useState<string>('grade');
  const [order, setOrder] = useState<Order>(Order.ASC);
  const [courseSchoolYears, setCourseSchoolYears] = useState<CourseSchoolYear[]>([]);
  const [paginate, setPaginate] = useState<PaginateData>({
    totalItems: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
  });

  const fetchCourseSchoolYears = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const trimmedSearch = searchTerm.trim();
      
      // Construir parámetros de la petición
      const params: CourseSchoolYearPaginateParams = { 
        page, 
        perPage: paginate.perPage,
        orderBy,
        order,
      };
      
      if (trimmedSearch) params.searchTerm = trimmedSearch;
      if (grade !== '') params.grade = grade as number;
      if (schoolYearId !== '') params.schoolYearId = schoolYearId as number;
      if (professorId !== '') params.professorId = professorId as number;
      
      const response = await getPaginate(params);
      setCourseSchoolYears(response.items);
      setPaginate(response.paginate);
    } catch (error) {
      if (error instanceof BackendError)
        dispatch(setErrorMessage(error.getMessage()));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch, page, paginate.perPage, searchTerm, grade, schoolYearId, professorId, orderBy, order]);

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

  // Manejador para cambios en el filtro de año escolar
  const handleSchoolYearChange = useCallback((value: number | '') => {
    setSchoolYearId(value);
    setPage(1); // Resetear a la primera página al cambiar el filtro
  }, []);

  // Manejador para cambios en el filtro de profesor
  const handleProfessorChange = useCallback((value: number | '') => {
    setProfessorId(value);
    setPage(1); // Resetear a la primera página al cambiar el filtro
  }, []);

  // Manejador para cambios en el ordenamiento
  const handleSortChange = useCallback((sortField: string, sortOrder: Order) => {
    setOrderBy(sortField);
    setOrder(sortOrder);
    setPage(1); // Resetear a la primera página al cambiar el ordenamiento
  }, []);

  useEffect(() => {
    fetchCourseSchoolYears();
  }, [fetchCourseSchoolYears]);

  return { 
    courseSchoolYears, 
    paginate, 
    setPage, 
    fetchCourseSchoolYears,
    searchTerm,
    setSearchTerm: setSearchTermDebounced,
    grade,
    setGrade: handleGradeChange,
    schoolYearId,
    setSchoolYearId: handleSchoolYearChange,
    professorId,
    setProfessorId: handleProfessorChange,
    orderBy,
    order,
    setSort: handleSortChange
  };
} 