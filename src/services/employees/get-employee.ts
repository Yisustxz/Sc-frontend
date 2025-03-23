import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { Employees } from 'core/employees/types';
import BackendError from 'exceptions/backend-error';
import store from 'store';

const URL = `${API_BASE_URL}/api/v1/employee`;

export default async function getEmployee(id: number ): Promise<Employees> {
  try {
    const response = await axios.get<Employees>(
        `${URL}/${id}`, {
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
