export enum EmployeeRole {
  administrative = "Administrativo",
  professor = "Profesor",
  director = "Director",
  coordinator = "Coordinador",
}

export interface Employees {
  employeeDni: string;
  name: string;
  lastName: string,
  email: string;
  address: string;
  phone: string;
  role: EmployeeRole;
}
