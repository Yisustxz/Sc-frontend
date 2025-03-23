import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import BackendError from 'exceptions/backend-error';

const URL = `${API_BASE_URL}/auth/login`;

const BYPASS_LOGIN = true;

export default async function login(body: LoginBody): Promise<LoginResponse> {
  try {
    if (BYPASS_LOGIN) {
      return {
        name: 'Test User',
        email: '',
        token: 'test-token',
      };
    }

    console.log('URL ' + URL);
    const response = await axios.post<LoginResponse>(URL, body);
    console.log('respuesta',response);
    return response.data;
  } catch (error: unknown) {
    throw new BackendError(error);
  }
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  name:string;
  email:string;
}
