import { useState, useEffect } from 'react';
import { getStudentQualificationsDetail, StudentQualificationsDetailResponse } from '../services/course-school-year/get-student-qualifications-detail';

interface UseStudentQualificationsDetailResult {
  data: StudentQualificationsDetailResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useStudentQualificationsDetail = (
  courseSchoolYearId: number,
  studentId: number
): UseStudentQualificationsDetailResult => {
  const [data, setData] = useState<StudentQualificationsDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudentQualificationsDetail(courseSchoolYearId, studentId);
      setData(response);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar los datos');
      console.error('Error fetching student qualifications detail:', err);
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
