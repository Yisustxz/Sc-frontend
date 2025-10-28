import axios from 'axios';
import { API_BASE_URL } from 'config/constants';
import BackendError from 'exceptions/backend-error';

const URL = `${API_BASE_URL}/auth/me`;

export default async function getMe(token: string): Promise<MeResponse> {
  try {
    const response = await axios.get<MeResponse>(URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: unknown) {
    throw new BackendError(error);
  }
}

export interface MeResponse {
  accessToken: string;
  name: string;
  email: string;
  role: string;
  professors: number[];
}

