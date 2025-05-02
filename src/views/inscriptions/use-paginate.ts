import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch } from 'store';
import { setIsLoading, setErrorMessage } from 'store/customizationSlice';
import getPaginate from 'services/inscriptions/get-paginate';
import BackendError from 'exceptions/backend-error';
import { PaginatedResponse } from 'services/types';
import { InscriptionDto, PaginateInscriptionDto } from 'core/inscriptions/types';

interface PaginateData {
  totalItems: number;
  page: number;
  perPage: number;
  totalPages: number;
}

interface UsePaginateReturnType {
  inscriptions: InscriptionDto[];
  paginate: PaginateData;
  setPaginate: React.Dispatch<React.SetStateAction<PaginateData>>;
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  schoolYearId: number | undefined;
  setSchoolYearId: (id: number | undefined) => void;
  gradeFilter: string | undefined;
  setGradeFilter: (grade: string | undefined) => void;
  fetchInscriptions: () => Promise<void>;
  order: 'ASC' | 'DESC';
  setOrder: (order: 'ASC' | 'DESC') => void;
  setPage: (page: number) => void;
}

export default function usePaginate(): UsePaginateReturnType {
  const dispatch = useAppDispatch();

  // Estado único para manejar la paginación
  const [paginate, setPaginate] = useState<PaginateData>({
    totalItems: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
  });

  const [inscriptions, setInscriptions] = useState<InscriptionDto[]>([]);
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
        page: paginate.page,
        perPage: paginate.perPage,
        order,
        schoolYearId,
        gradeFilter,
        search: searchTerm || undefined,
      };

      // Obtener los datos paginados
      const response: PaginatedResponse<InscriptionDto> = await getPaginate(params);

      // Actualizar los estados con los resultados
      setInscriptions(response.items || []);
      setPaginate((prev) => ({
        ...prev,
        totalItems: response.paginate?.totalItems || 0,
        totalPages: response.paginate?.totalPages || 0,
      }));
    } catch (error) {
      if (error instanceof BackendError) {
        dispatch(setErrorMessage(error.getMessage()));
      } else {
        dispatch(setErrorMessage('Error al cargar las inscripciones'));
      }
      setInscriptions([]);
      setPaginate((prev) => ({
        ...prev,
        totalItems: 0,
        totalPages: 0,
      }));
    } finally {
      setLoading(false);
      dispatch(setIsLoading(false));
    }
  }, [dispatch, paginate.page, paginate.perPage, order, schoolYearId, gradeFilter, searchTerm]);

  // Efecto para cargar datos cuando cambian los filtros o la paginación
  useEffect(() => {
    fetchInscriptions();
  }, [fetchInscriptions]);

  const setPage = useCallback((page: number) => {
    setPaginate((prev) => ({ ...prev, page }));
  }, []);

  return {
    inscriptions,
    paginate,
    setPaginate,
    loading,
    searchTerm,
    setSearchTerm,
    schoolYearId,
    setSchoolYearId,
    gradeFilter,
    setGradeFilter,
    fetchInscriptions,
    order,
    setOrder,
    setPage,
  };
}
