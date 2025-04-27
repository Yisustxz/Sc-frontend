import axios from 'axios';
// Own
import { API_BASE_URL } from 'config/constants';
import { CourseSchoolYear } from 'core/course-school-year/types';
import BackendError from 'exceptions/backend-error';
import addQueryParams from 'services/add-query-params';
import { PaginatedResponse } from 'services/types';
import store from 'store';

const URL = `${API_BASE_URL}/course-school-year`;

type QueryParams = Record<string, string | number | boolean | null>;

export interface CourseSchoolYearPaginateParams {
  page?: number;
  perPage?: number;
  searchTerm?: string;
  schoolYearId?: number;
  grade?: number;
  professorId?: number;
  orderBy?: string;
  order?: 'ASC' | 'DESC';
}

export default async function getPaginate(params: CourseSchoolYearPaginateParams): Promise<CourseSchoolYearPaginated> {
  try {
    // Filtrar los parámetros undefined y convertir a QueryParams
    const filteredParams: QueryParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        filteredParams[key] = value;
      }
    });
    
    const urlPaginated = addQueryParams(URL, filteredParams);
    const response = await axios.get<CourseSchoolYearPaginated>(
      urlPaginated, {
        headers: {
          Authorization: `Bearer ${store.getState().auth.token}`,
        }
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.log(error);
    throw new BackendError(error);
  }
}

export type CourseSchoolYearPaginated = PaginatedResponse<CourseSchoolYear>; 