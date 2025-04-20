import { useCallback, useEffect, useState } from "react";
import { SchoolLapse, SchoolCourt } from "../../../../core/school-year/types";
import { SchoolLapseForm, SchoolCourtForm } from "../../form";

/**
 * Hook para gestionar el estado local de los lapsos y sus operaciones CRUD
 */
const useLocalLapses = (
  inputLapses: SchoolLapseForm[], 
  onChange: (lapses: SchoolLapseForm[]) => void
) => {
  // Transformar lapsos de entrada al formato local
  const transformInputLapses = useCallback((lapses: SchoolLapseForm[]): SchoolLapseForm[] => {
    return lapses.map((lapse, index) => ({
      ...lapse,
      lapseId: lapse.lapseId || index, // Usamos índice como ID temporal si no tiene
      onlineState: lapse,
      isNew: lapse.isNew || false,
      isDirty: lapse.isDirty || false,
      schoolCourts: lapse.schoolCourts.map((court, courtIndex) => ({
        ...court,
        courtId: court.courtId || courtIndex, // Usamos índice como ID temporal si no tiene
        onlineState: court,
        isNew: court.isNew || false,
        isDirty: court.isDirty || false
      }))
    }));
  }, []);

  const [localLapses, setLocalLapses] = useState<SchoolLapseForm[]>(
    transformInputLapses(inputLapses)
  );

  // Actualizar estado local cuando cambian los lapsos de entrada
  useEffect(() => {
    if (inputLapses.length > 0 && localLapses.length === 0) {
      setLocalLapses(transformInputLapses(inputLapses));
    }
  }, [inputLapses, localLapses.length, transformInputLapses]);

  // Notificar cambios hacia arriba
  useEffect(() => {
    onChange(localLapses);
  }, [localLapses, onChange]);

  // Eliminar un lapso (soft delete si tiene onlineState, hard delete si es nuevo)
  const onDelete = useCallback((index: number) => {
    setLocalLapses(prev => {
      const newLapses = [...prev];
      const lapse = newLapses[index];
      
      // Hard delete para lapsos nuevos
      if (lapse.isNew) {
        newLapses.splice(index, 1);
      } else {
        // Soft delete para lapsos existentes
        newLapses[index] = {
          ...lapse,
          localDeleted: true,
          isDirty: true
        };
      }
      
      return newLapses;
    });
  }, []);

  // Restaurar un lapso eliminado
  const onRevertDelete = useCallback((index: number) => {
    setLocalLapses(prev => {
      const newLapses = [...prev];
      newLapses[index] = {
        ...newLapses[index],
        localDeleted: false,
        isDirty: true
      };
      return newLapses;
    });
  }, []);

  // Actualizar un lapso
  const onUpdate = useCallback((index: number, updatedLapse: Partial<SchoolLapseForm>) => {
    setLocalLapses(prev => {
      const newLapses = [...prev];
      const currentLapse = newLapses[index];
      
      newLapses[index] = {
        ...currentLapse,
        ...updatedLapse,
        isDirty: true // Marcar como modificado
      };
      
      return newLapses;
    });
  }, []);

  // Crear un nuevo lapso
  const onCreate = useCallback((newLapse: SchoolLapseForm) => {
    setLocalLapses(prev => {
      const maxId = prev.length > 0 
        ? Math.max(...prev.map(l => l.lapseId || 0)) 
        : 0;
        
      return [
        ...prev,
        {
          ...newLapse,
          lapseId: maxId + 1,
          isNew: true, // Marcar como nuevo
          isDirty: true
        }
      ];
    });
  }, []);

  // Actualizar un corte dentro de un lapso
  const onUpdateCourt = useCallback((lapseIndex: number, courtIndex: number, updatedCourt: Partial<SchoolCourtForm>) => {
    setLocalLapses(prev => {
      const newLapses = [...prev];
      const currentLapse = {...newLapses[lapseIndex]};
      const currentCourts = [...currentLapse.schoolCourts];
      const currentCourt = currentCourts[courtIndex];
      
      currentCourts[courtIndex] = {
        ...currentCourt,
        ...updatedCourt,
        isDirty: true // Marcar como modificado
      };
      
      newLapses[lapseIndex] = {
        ...currentLapse,
        schoolCourts: currentCourts,
        isDirty: true // El lapso padre también se marca como modificado
      };
      
      return newLapses;
    });
  }, []);

  // Crear un nuevo corte dentro de un lapso
  const onCreateCourt = useCallback((lapseIndex: number, newCourt: SchoolCourtForm) => {
    setLocalLapses(prev => {
      const newLapses = [...prev];
      const currentLapse = {...newLapses[lapseIndex]};
      const currentCourts = [...currentLapse.schoolCourts];
      
      const maxId = currentCourts.length > 0 
        ? Math.max(...currentCourts.map(c => c.courtId || 0)) 
        : 0;
      
      const courtToAdd = {
        ...newCourt,
        courtId: maxId + 1,
        isNew: true, // Marcar como nuevo
        isDirty: true
      };
      
      newLapses[lapseIndex] = {
        ...currentLapse,
        schoolCourts: [...currentCourts, courtToAdd],
        isDirty: true // El lapso padre también se marca como modificado
      };
      
      return newLapses;
    });
  }, []);

  // Eliminar un corte dentro de un lapso
  const onDeleteCourt = useCallback((lapseIndex: number, courtIndex: number) => {
    setLocalLapses(prev => {
      const newLapses = [...prev];
      const currentLapse = {...newLapses[lapseIndex]};
      const currentCourts = [...currentLapse.schoolCourts];
      const court = currentCourts[courtIndex];
      
      // Hard delete para cortes nuevos
      if (court.isNew) {
        currentCourts.splice(courtIndex, 1);
      } else {
        // Soft delete para cortes existentes
        currentCourts[courtIndex] = {
          ...court,
          localDeleted: true,
          isDirty: true
        };
      }
      
      newLapses[lapseIndex] = {
        ...currentLapse,
        schoolCourts: currentCourts,
        isDirty: true // El lapso padre también se marca como modificado
      };
      
      return newLapses;
    });
  }, []);

  // Restaurar un corte eliminado
  const onRevertDeleteCourt = useCallback((lapseIndex: number, courtIndex: number) => {
    setLocalLapses(prev => {
      const newLapses = [...prev];
      const currentLapse = {...newLapses[lapseIndex]};
      const currentCourts = [...currentLapse.schoolCourts];
      
      currentCourts[courtIndex] = {
        ...currentCourts[courtIndex],
        localDeleted: false,
        isDirty: true
      };
      
      newLapses[lapseIndex] = {
        ...currentLapse,
        schoolCourts: currentCourts,
        isDirty: true // El lapso padre también se marca como modificado
      };
      
      return newLapses;
    });
  }, []);

  return {
    localLapses,
    onDelete,
    onRevertDelete,
    onUpdate,
    onCreate,
    onUpdateCourt,
    onCreateCourt,
    onDeleteCourt,
    onRevertDeleteCourt
  };
};

export default useLocalLapses; 