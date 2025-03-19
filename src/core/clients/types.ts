export interface Client {
  clientDni: string;
  name: string;
  email: string;
  mainPhone: string;
  secondaryPhone: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}
