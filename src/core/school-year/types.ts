export interface SchoolCourt {
  id?: number;
  startDate: string;
  endDate: string;
  // Propiedades para manejo local
  courtId?: number | null;
  onlineState?: SchoolCourt;
  localDeleted?: boolean;
}

export interface SchoolLapse {
  id?: number;
  startDate: string;
  endDate: string;
  schoolCourts: SchoolCourt[];
  // Propiedades para manejo local
  lapseId?: number | null;
  onlineState?: SchoolLapse;
  localDeleted?: boolean;
}

export interface SchoolYear {
  id: number;
  code: string;
  startDate: string;
  endDate: string;
  schoolLapses: SchoolLapse[];
}

export interface SchoolYearPayload {
  schoolYear: {
    code: string;
    startDate: string;
    endDate: string;
  };
  schoolLapses: SchoolLapse[];
} 