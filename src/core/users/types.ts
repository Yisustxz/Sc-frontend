
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  password?: string;
}

export interface UserTeacher {
  id: number;
  name: string;
  email: string;
  role: string;
}
