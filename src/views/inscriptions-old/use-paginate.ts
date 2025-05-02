import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch } from 'store';
import { setIsLoading, setErrorMessage } from 'store/customizationSlice';
import { PaginateInscriptionDto, InscriptionDto } from '../../core/inscriptions/types';
import getPaginate from 'services/inscriptions/get-paginate';
import BackendError from 'exceptions/backend-error';

interface UsePaginateReturnType {
  inscriptions: InscriptionDto[];
  paginate: {
    totalItems: number;
    totalPages: number;
    page: number;
    perPage: number;
  };
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  schoolYearId: number | undefined;
  setSchoolYearId: (id: number | undefined) => void;
  gradeFilter: string | undefined;
  setGradeFilter: (grade: string | undefined) => void;
  page: number;
  setPage: (page: number) => void;
  perPage: number;
  setPerPage: (perPage: number) => void;
  fetchInscriptions: () => Promise<void>;
  order: 'ASC' | 'DESC';
  setOrder: (order: 'ASC' | 'DESC') => void;
}

export default function usePaginate(): UsePaginateReturnType {
  const dispatch = useAppDispatch();
  
  // Estados para manejar la paginación y filtros
  const [inscriptions, setInscriptions] = useState<InscriptionDto[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [schoolYearId, setSchoolYearId] = useState<number | undefined>(undefined);
  const [gradeFilter, setGradeFilter] = useState<string | undefined>(undefined);
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');

  // Función para obtener las inscripciones con los filtros actuales
  const fetchInscriptions = useCallback(async () => {
    try {
      setLoading(true);
      dispatch(setIsLoading(true));

      // Preparar los parámetros de consulta
      const params: PaginateInscriptionDto = {
        page,
        perPage,
        order,
        schoolYearId,
        gradeFilter,
        search: searchTerm || undefined
      };

      // Obtener los datos paginados
      const response = await getPaginate(params);
      
      // Actualizar los estados con los resultados
      setInscriptions(response.items || []);
      setTotalItems(response.paginate?.totalItems || 0);
      setTotalPages(response.paginate?.totalPages || 0);
    } catch (error) {
      if (error instanceof BackendError) {
        dispatch(setErrorMessage(error.getMessage()));
      } else {
        dispatch(setErrorMessage('Error al cargar las inscripciones'));
      }
      setInscriptions([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
      dispatch(setIsLoading(false));
    }
  }, [dispatch, page, perPage, searchTerm, schoolYearId, gradeFilter, order]);

  // Efecto para cargar datos cuando cambian los filtros o la paginación
  useEffect(() => {
    fetchInscriptions();
  }, [fetchInscriptions]);

  return {
    inscriptions,
    paginate: {
      totalItems,
      totalPages,
      page,
      perPage
    },
    loading,
    searchTerm,
    setSearchTerm,
    schoolYearId,
    setSchoolYearId,
    gradeFilter,
    setGradeFilter,
    page,
    setPage,
    perPage,
    setPerPage,
    fetchInscriptions,
    order,
    setOrder
  };
}
