import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Employees } from 'core/employees/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/employee`;

export default async function editEmployee(id: number , body: EmployeePayload): Promise<Employees> {
  try {
    const response = await axios.put<Employees>(
      `${URL}/${id}`,body,
      {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.log("Error en editClient:", error);
    throw new BackendError(error);
  }
}

export type EmployeePayload = Omit<Employees, 'dni' | 'createdAt'>;
