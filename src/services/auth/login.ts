import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import BackendError from 'exceptions/backend-error';

const URL = `${API_BASE_URL}/auth/login`;

export default async function login(body: LoginBody): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(URL, body);
    console.log('response',response.data);
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
  accessToken: string;
  name:string;
  email:string;
}
