import { useCallback, useEffect, useState } from "react";
import { SchoolLapse, SchoolCourt } from "../../../../core/school-year/types";
import { SchoolLapseForm, SchoolCourtForm } from "../types";

/**
 * Hook para gestionar el estado local de los lapsos y sus operaciones CRUD
 */
const useLocalLapses = (
  inputLapses: SchoolLapseForm[], 
  onChange: (lapses: SchoolLapseForm[]) => void
) => {
  // Transformar lapsos de entrada al formato local
  const transformInputLapses = useCallback((lapses: SchoolLapseForm[]): SchoolLapseForm[] => {
    return lapses.map((lapse: SchoolLapseForm, index: number) => ({
      ...lapse,
      lapseId: lapse.lapseId || index, // Usamos índice como ID temporal si no tiene
      onlineState: lapse,
      isNew: lapse.isNew || false,
      isDirty: lapse.isDirty || false,
      schoolCourts: lapse.schoolCourts.map((court: SchoolCourtForm, courtIndex: number) => ({
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
      const lapse = newLapses[index];
      const onlineState = lapse.onlineState;
      
      // Al restaurar, verificamos si hay cambios reales comparados con el estado original
      const hasChanges = 
        lapse.startDate !== onlineState.startDate || 
        lapse.endDate !== onlineState.endDate;
      
      // Si no tiene cambios aparte del soft-delete, lo restauramos limpiamente
      newLapses[index] = {
        ...lapse,
        localDeleted: false,
        isDirty: hasChanges // Solo será dirty si tenía otros cambios antes de ser eliminado
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
      return [
        ...prev,
        {
          ...newLapse,
          lapseId: undefined, // Usamos undefined en lugar de null para respetar el tipo
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
      
      const courtToAdd = {
        ...newCourt,
        courtId: undefined, // Usamos undefined en lugar de null para respetar el tipo
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
      const court = currentCourts[courtIndex];
      const onlineState = court.onlineState;
      
      // Al restaurar, verificamos si hay cambios reales comparados con el estado original
      const hasChanges = 
        court.startDate !== onlineState.startDate || 
        court.endDate !== onlineState.endDate;
      
      currentCourts[courtIndex] = {
        ...court,
        localDeleted: false,
        isDirty: hasChanges // Solo será dirty si tenía otros cambios antes de ser eliminado
      };
      
      // Verificamos si el lapso todavía tiene cortes modificados
      const hasModifiedCourts = currentCourts.some(c => c.isDirty || c.isNew || c.localDeleted);
      
      newLapses[lapseIndex] = {
        ...currentLapse,
        schoolCourts: currentCourts,
        isDirty: hasModifiedCourts || currentLapse.isDirty // Mantenemos el estado dirty si ya tenía otros cambios
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