export interface SchoolCourt {
  startDate: string;
  endDate: string;
}

export interface SchoolLapse {
  startDate: string;
  endDate: string;
  schoolCourts: SchoolCourt[];
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