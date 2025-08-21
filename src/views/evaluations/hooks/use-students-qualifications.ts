import { useState, useCallback } from 'react';
// Own
import { setIsLoading, setErrorMessage } from 'store/customizationSlice';
import { useAppDispatch } from '../../../store/index';
import BackendError from 'exceptions/backend-error';
import { getStudentsByEvaluation } from 'services/evaluations/get-students-by-evaluation';
import { updateBulkQualifications, updateSingleQualification } from 'services/evaluations/update-qualifications';
import { EvaluationWithStudents, UpdateQualificationData, BulkUpdateQualificationsData, StudentEvaluationQualification } from 'core/evaluations/types';

interface UseStudentsQualificationsReturn {
  students: StudentEvaluationQualification[];
  evaluation: EvaluationWithStudents['evaluation'] | null;
  isLoading: boolean;
  error: Error | null;
  loadStudentsByEvaluation: (evaluationId: number) => Promise<boolean>;
  updateStudentQualification: (evaluationId: number, data: UpdateQualificationData) => Promise<boolean>;
  updateBulkStudentQualifications: (evaluationId: number, data: UpdateQualificationData[]) => Promise<boolean>;
}

/**
 * Hook para gestionar las calificaciones de estudiantes en una evaluación
 * @returns Funciones y estado para gestionar calificaciones
 */
const useStudentsQualifications = (): UseStudentsQualificationsReturn => {
  const dispatch = useAppDispatch();
  const [students, setStudents] = useState<StudentEvaluationQualification[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationWithStudents['evaluation'] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Carga los estudiantes y sus calificaciones para una evaluación específica
   */
  const loadStudentsByEvaluation = useCallback(async (evaluationId: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getStudentsByEvaluation(evaluationId);
      setStudents(data.students || []);
      setEvaluation(data.evaluation);
      return true;
    } catch (err: any) {
      console.error('Error loading students for evaluation:', err);
      setError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Actualiza la calificación de un estudiante
   * @param evaluationId ID de la evaluación
   * @param data Datos de la calificación a actualizar
   * @returns true si se actualizó correctamente, false si hubo error
   */
  const updateStudentQualification = useCallback(async (
    evaluationId: number,
    data: UpdateQualificationData
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await updateSingleQualification(evaluationId, data);
      
      if (success) {
        // Actualizar el estado local con la nueva calificación
        setStudents(prevStudents => prevStudents.map(student => {
          if (student.courseInscriptionId === data.courseInscriptionId) {
            return {
              ...student,
              qualification: data.didNotPresent ? null : data.qualification,
              didNotPresent: data.didNotPresent
            };
          }
          return student;
        }));
      }
      
      return !!success;
    } catch (err: any) {
      console.error('Error updating student qualification:', err);
      setError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Actualiza las calificaciones de múltiples estudiantes
   * @param evaluationId ID de la evaluación
   * @param data Array de calificaciones a actualizar
   * @returns true si se actualizaron correctamente, false si hubo error
   */
  const updateBulkStudentQualifications = useCallback(async (
    evaluationId: number,
    data: UpdateQualificationData[]
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await updateBulkQualifications(evaluationId, { qualifications: data });
      
      if (success) {
        // Crear un mapa de las calificaciones actualizadas
        const updatedQualificationsMap = new Map<number, UpdateQualificationData>();
        data.forEach(item => {
          updatedQualificationsMap.set(item.courseInscriptionId, item);
        });
        
        // Actualizar el estado local con las nuevas calificaciones
        setStudents(prevStudents => prevStudents.map(student => {
          const updatedData = updatedQualificationsMap.get(student.courseInscriptionId);
          if (updatedData) {
            return {
              ...student,
              qualification: updatedData.didNotPresent ? null : updatedData.qualification,
              didNotPresent: updatedData.didNotPresent
            };
          }
          return student;
        }));
      }
      
      return !!success;
    } catch (err: any) {
      console.error('Error updating bulk qualifications:', err);
      setError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    students,
    evaluation,
    isLoading,
    error,
    loadStudentsByEvaluation,
    updateStudentQualification,
    updateBulkStudentQualifications
  };
};

export default useStudentsQualifications; 