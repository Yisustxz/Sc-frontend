import { useState } from 'react';
import { InscriptionDto, PaginateInscriptionDto, CreateInscriptionDto, UpdateInscriptionDto } from '../../../core/inscriptions/types';
import createInscriptionService from 'services/inscriptions/create-inscription';
import updateInscriptionService from 'services/inscriptions/update-inscription';
import deleteInscriptionService from 'services/inscriptions/delete-inscription';
import getInscriptionService from 'services/inscriptions/get-inscription';
import getPaginateService from 'services/inscriptions/get-paginate';

export interface UseInscriptionsReturnType {
  inscriptions: InscriptionDto[];
  totalItems: number;
  loading: boolean;
  error: string | null;
  fetchInscriptions: (params: PaginateInscriptionDto) => Promise<void>;
  getInscription: (id: number) => Promise<InscriptionDto>;
  createInscription: (data: CreateInscriptionDto | UpdateInscriptionDto) => Promise<InscriptionDto>;
  updateInscription: (id: number, data: UpdateInscriptionDto) => Promise<InscriptionDto>;
  deleteInscription: (id: number) => Promise<void>;
}

export const useInscriptions = (): UseInscriptionsReturnType => {
  const [inscriptions, setInscriptions] = useState<InscriptionDto[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener lista paginada de inscripciones
  const fetchInscriptions = async (params: PaginateInscriptionDto): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPaginateService(params);
      setInscriptions(response.items || []);
      setTotalItems(response.paginate?.totalItems || 0);
    } catch (error) {
      console.error('Error fetching inscriptions:', error);
      setError('Error al cargar inscripciones');
      setInscriptions([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  // Obtener una inscripción por ID
  const getInscription = async (id: number): Promise<InscriptionDto> => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInscriptionService(id);
      return response;
    } catch (error) {
      console.error(`Error fetching inscription with ID ${id}:`, error);
      setError(`Error al obtener la inscripción con ID ${id}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Crear una nueva inscripción
  const createInscription = async (data: CreateInscriptionDto | UpdateInscriptionDto): Promise<InscriptionDto> => {
    setLoading(true);
    setError(null);
    try {
      // Aseguramos que todos los campos requeridos estén presentes para CreateInscriptionDto
      if (!data.studentId || !data.schoolYearId || !data.grade || !data.courseInscriptions) {
        throw new Error('Faltan campos requeridos en la inscripción');
      }
      const response = await createInscriptionService(data as CreateInscriptionDto);
      return response;
    } catch (error) {
      console.error('Error creating inscription:', error);
      setError('Error al crear la inscripción');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar una inscripción existente
  const updateInscription = async (id: number, data: UpdateInscriptionDto): Promise<InscriptionDto> => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateInscriptionService(id, data);
      return response;
    } catch (error) {
      console.error(`Error updating inscription with ID ${id}:`, error);
      setError(`Error al actualizar la inscripción con ID ${id}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una inscripción
  const deleteInscription = async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await deleteInscriptionService(id);
    } catch (error) {
      console.error(`Error deleting inscription with ID ${id}:`, error);
      setError(`Error al eliminar la inscripción con ID ${id}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    inscriptions,
    totalItems,
    loading,
    error,
    fetchInscriptions,
    getInscription,
    createInscription,
    updateInscription,
    deleteInscription
  };
}; 