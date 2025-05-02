// Tipos base
export interface StudentDto {
  id: number;
  name: string;
  lastName?: string;
  dni?: string;
  person?: {
    dni: string;
    name: string;
    lastName: string;
  };
}

export interface RepresentativeDto {
  id: number;
  name: string;
  lastName?: string;
  dni?: string;
  fullInfo?: string;
}

export interface SchoolYearDto {
  id: number;
  code: string;
  year?: string;
  isActive?: boolean;
}

export interface CourseDto {
  id: number;
  name: string;
}

export interface ProfessorDto {
  id: number;
  name: string;
}

export interface CourseSchoolYearDto {
  id: number;
  grade: string | number;
  courseId: number;
  course?: CourseDto;
  professor?: ProfessorDto;
}

// DTOs de inscripciones
export interface CourseInscriptionDto {
  id?: number;
  inscriptionId: number;
  courseSchoolYearId: number;
  courseSchoolYear?: CourseSchoolYearDto;
  inscription?: InscriptionDto;
}

export interface InscriptionDto {
  id: number;
  studentId: number;
  schoolYearId: number;
  grade: string;
  student?: StudentDto;
  schoolYear?: SchoolYearDto;
  representative?: RepresentativeDto;
  courseInscriptions?: CourseInscriptionDto[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// DTOs para crear y actualizar inscripciones
export interface CreateCourseInscriptionDto {
  id?: number;
  courseSchoolYearId: number;
}

export interface CreateInscriptionDto {
  studentId: number;
  schoolYearId: number;
  grade: string;
  courseInscriptions: CreateCourseInscriptionDto[];
}

export interface UpdateCourseInscriptionDto {
  id?: number;
  courseSchoolYearId: number;
}

export interface UpdateInscriptionDto {
  studentId?: number;
  schoolYearId?: number;
  grade?: string;
  courseInscriptions?: UpdateCourseInscriptionDto[];
}

// DTOs para paginación
export interface PaginateInscriptionDto {
  page?: number;
  limit?: number;
  perPage?: number;
  schoolYearId?: number | string;
  gradeFilter?: string;
  search?: string;
  order?: 'ASC' | 'DESC';
  orderBy?: string;
}

// Respuesta paginada
export interface PaginateInscriptionResponseDto {
  items: InscriptionDto[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
} 