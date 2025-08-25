import { useState, useEffect } from 'react';
import { getStudentGradesDetail, StudentGradesDetailResponse } from '../services/course-school-year/get-student-grades-detail';

interface UseStudentGradesDetailResult {
  data: StudentGradesDetailResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useStudentGradesDetail = (
  courseSchoolYearId: number,
  studentId: number
): UseStudentGradesDetailResult => {
  const [data, setData] = useState<StudentGradesDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudentGradesDetail(courseSchoolYearId, studentId);
      setData(response);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar los datos');
      console.error('Error fetching student grades detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseSchoolYearId && studentId) {
      fetchData();
    }
  }, [courseSchoolYearId, studentId]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};
