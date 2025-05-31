export interface SchoolCourt {
  id?: number;
  startDate: string;
  endDate: string;
  // Propiedades para manejo local
  courtId?: number | null;
  onlineState?: SchoolCourt;
  localDeleted?: boolean;
  courtNumber?: number;
  isExpanded?: boolean;
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
  lapseNumber?: number;
  isExpanded?: boolean;
}

export interface SchoolYear {
  id: number;
  code: string;
  startDate: string;
  endDate: string;
  schoolLapses: SchoolLapse[];
  courseSchoolYears?: CourseSchoolYear[];
}

// Interfaz simplificada para selectores y componentes de UI que solo necesitan id y código
export interface SchoolYearSelect {
  id: number;
  code: string;
}

export interface SchoolYearPayload {
  schoolYear: {
    code: string;
    startDate: string;
    endDate: string;
  };
  schoolLapses: SchoolLapse[];
}

export interface CourseSchoolYear {
  id?: number;
  grade: number;
  weeklyHours?: number;
  professorId?: number | null;
  courseId: number;
  schoolYearId?: number;
  isNew?: boolean;
  isDirty?: boolean;
  localDeleted?: boolean;
  onlineState?: any;

  // Propiedades expandidas
  course?: {
    id: number;
    name: string;
  };

  professor?: {
    id: number;
    name: string;
  };

  // Propiedades para mostrar en UI
  courseName?: string;
  professorName?: string;
}
