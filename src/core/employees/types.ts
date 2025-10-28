import { User } from 'core/users/types';

export enum TypeEmployee {
  Professor = 'professor',
  Substitute = 'substitute',
  Worker = 'worker',
}

export interface Employees {
  id: number;
  dni: string;
  name: string;
  lastName: string,
  phone: string;
  direction: string;
  birthDate: string;
  employeeType: TypeEmployee;
  userId?: number;
  assignedUser?: User;
}
