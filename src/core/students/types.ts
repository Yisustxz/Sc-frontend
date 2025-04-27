import { Representatives } from "core/representatives/types";

export interface Students {
  id: number,
  dni: string;
  name: string;
  lastName: string,
  phone: string,
  direction: string
  birthDate: string;
  representative?: Representatives;
  representativeId?: number;
}

