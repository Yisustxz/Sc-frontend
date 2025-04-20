import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Employees } from 'core/employees/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';
import addQueryParams from 'services/add-query-params';

// URL del endpoint de obtener todos los empleados
const URL = `${API_BASE_URL}/employee/all`;

// Interfaz para los parámetros de búsqueda
export interface GetAllEmployeesParams {
  employeeType?: string; // 'professor', 'substitute', 'worker'
  name?: string;
  [key: string]: any; // Firma de índice para permitir cualquier propiedad adicional
}

/**
 * Obtiene todos los empleados con opción de filtrado
 * @param params Parámetros opcionales de filtrado
 * @returns Lista de empleados
 */
export default async function getAllEmployees(params?: GetAllEmployeesParams): Promise<Employees[]> {
  try {
    // Crear la URL con los parámetros de consulta
    const urlWithParams = params ? addQueryParams(URL, params) : URL;
    
    console.log('Employee request URL:', urlWithParams);
    
    const response = await axios.get<Employees[]>(
      urlWithParams, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.log(error);
    throw new BackendError(error);
  }
}