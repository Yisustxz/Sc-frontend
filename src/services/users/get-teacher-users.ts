import axios from 'axios';
import { API_BASE_URL } from 'config/constants';
import { UserTeacher } from 'core/users/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/users/teachers`;

/**
 * Busca usuarios con rol de profesor
 * @param forceItemsIds Lista de IDs que deben incluirse siempre
 * @param searchTerm Término de búsqueda para filtrar por nombre
 * @param limit Límite máximo de resultados
 * @returns Lista de usuarios teachers
 */
export default async function getTeacherUsers(
  forceItemsIds?: number[],
  searchTerm?: string | null,
  limit?: number | null
): Promise<UserTeacher[]> {
  try {
    const params = new URLSearchParams();
    
    if (forceItemsIds && forceItemsIds.length > 0) {
      params.append('forceItemsIds', forceItemsIds.join(','));
    }
    
    if (searchTerm && searchTerm.trim()) {
      params.append('searchTerm', searchTerm.trim());
    }
    
    if (limit && limit > 0) {
      params.append('limit', limit.toString());
    }

    const url = `${URL}?${params.toString()}`;
    
    const response = await axios.get<UserTeacher[]>(url, {
      headers: {
        Authorization: `Bearer ${store.getState().auth.token}`,
      }
    });
    
    return response.data;
  } catch (error: unknown) {
    console.log('Error fetching teacher users:', error);
    throw new BackendError(error);
  }
}
