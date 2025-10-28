export interface AuthState {
  user: null | {
    email: string;
    name: string;
    role: string;
    professors: number[];
  },
  token: null | string;
  isAuth: boolean;
}

export interface AuthStored {
  user: {
    email: string;
    name: string;
    role: string;
    professors: number[];
  },
  token: string;
}

export const STORAGE_KEY = 'leafeon-auth-storage';
