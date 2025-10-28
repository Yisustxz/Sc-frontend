import { useState, useEffect, useMemo, useCallback } from 'react';
import { UserTeacher } from 'core/users/types';
import getTeacherUsers from 'services/users/get-teacher-users';

const DEBOUNCE_DELAY = 300; // ms

interface UseGetTeacherUsersResult {
  data: UserTeacher[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook para obtener usuarios con rol de profesor con funcionalidad de búsqueda
 * @param forceItemsIds IDs que deben incluirse siempre en los resultados
 * @param searchTerm Término de búsqueda para filtrar por nombre
 * @param limit Límite máximo de resultados
 * @returns Objeto con data, loading state y error state
 */
export default function useGetTeacherUsers(
  forceItemsIds: number[],
  searchTerm: string | null,
  limit: number | null
): UseGetTeacherUsersResult {
  const [data, setData] = useState<UserTeacher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce del término de búsqueda
  const debouncedSearchTerm = useMemo(() => {
    const timeout = setTimeout(() => searchTerm, DEBOUNCE_DELAY);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

    const fetchTeacherUsers = useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await executeGetTeacherUsers(
          forceItemsIds,
          searchTerm,
          limit
        );

        setData(result);
      } catch (err: any) {
        console.error('Error fetching teacher users:', err);
        setError(err?.message || 'Error al cargar usuarios teachers');
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }, [forceItemsIds, limit, searchTerm]);


  useEffect(() => {
    if (forceItemsIds.length > 0 || (searchTerm && searchTerm.trim())) {
      fetchTeacherUsers();
    } else {
      setData([]);
      setIsLoading(false);
      setError(null);
    }
  }, [forceItemsIds, debouncedSearchTerm, limit, searchTerm, fetchTeacherUsers]);

  return { data, isLoading, error };
}

/**
 * Función auxiliar para ejecutar la búsqueda de usuarios teachers
 */
async function executeGetTeacherUsers(
  forceItemsIds: number[],
  searchTerm: string | null,
  limit: number | null
): Promise<UserTeacher[]> {
  return await getTeacherUsers(forceItemsIds, searchTerm, limit);
}
