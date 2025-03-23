import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Employees } from 'core/employees/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/api/v1/estudiante`;

export default async function createEmployee(body: EmployeePayload): Promise<Employees> {
  try {
    const response = await axios.post<Employees>(
        URL, body, {
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

export type EmployeePayload = Omit<Employees, 'dni' | 'createdAt'>;
