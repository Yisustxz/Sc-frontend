import { SchoolYear, SchoolLapse, SchoolCourt } from '../../../core/school-year/types';
import { SchoolLapseForm, SchoolCourtForm, FormValues } from '../form/types';

/**
 * Convierte un SchoolCourtForm (vista) a SchoolCourt (core)
 */
export const mapFormCourtToCourt = (court: SchoolCourtForm): SchoolCourt => {
  return {
    startDate: court.startDate,
    endDate: court.endDate,
    courtId: court.courtId,
    localDeleted: court.localDeleted,
    // Evitamos referencias circulares
    onlineState: court.onlineState ? {
      startDate: court.onlineState.startDate,
      endDate: court.onlineState.endDate
    } : undefined
  };
};

/**
 * Convierte un SchoolCourt (core) a SchoolCourtForm (vista)
 */
export const mapCourtToFormCourt = (court: SchoolCourt): SchoolCourtForm => {
  return {
    startDate: court.startDate,
    endDate: court.endDate,
    courtId: court.id || undefined,
    isNew: !court.id,
    isDirty: false
  };
};

/**
 * Convierte un SchoolLapseForm (vista) a SchoolLapse (core)
 */
export const mapFormLapseToLapse = (lapse: SchoolLapseForm): SchoolLapse => {
  return {
    startDate: lapse.startDate,
    endDate: lapse.endDate,
    lapseId: lapse.lapseId,
    localDeleted: lapse.localDeleted,
    // Evitamos referencias circulares
    onlineState: lapse.onlineState ? {
      startDate: lapse.onlineState.startDate,
      endDate: lapse.onlineState.endDate,
      schoolCourts: []
    } : undefined,
    schoolCourts: lapse.schoolCourts.map(mapFormCourtToCourt)
  };
};

/**
 * Convierte un SchoolLapse (core) a SchoolLapseForm (vista)
 */
export const mapLapseToFormLapse = (lapse: SchoolLapse): SchoolLapseForm => {
  return {
    startDate: lapse.startDate,
    endDate: lapse.endDate,
    lapseId: lapse.id || undefined,
    isNew: !lapse.id,
    isDirty: false,
    schoolCourts: lapse.schoolCourts.map(mapCourtToFormCourt)
  };
};

/**
 * Convierte los valores del formulario a la estructura requerida por el backend
 */
export const mapFormValuesToPayload = (values: FormValues): {
  schoolYear: {
    code: string;
    startDate: string;
    endDate: string;
  };
  schoolLapses: any[];
} => {
  return {
    schoolYear: {
      code: values.code,
      startDate: values.startDate,
      endDate: values.endDate
    },
    schoolLapses: values.lapses
      .filter((lapse: SchoolLapseForm) => !lapse.localDeleted)
      .map((lapse: SchoolLapseForm) => ({
        // Si tiene lapseId, enviarlo como id para identificar el lapso existente
        ...(lapse.lapseId && { id: lapse.lapseId }),
        startDate: lapse.startDate,
        endDate: lapse.endDate,
        schoolCourts: lapse.schoolCourts
          .filter((court: SchoolCourtForm) => !court.localDeleted)
          .map((court: SchoolCourtForm) => ({
            // Si tiene courtId, enviarlo como id para identificar el corte existente
            ...(court.courtId && { id: court.courtId }),
            startDate: court.startDate,
            endDate: court.endDate
          }))
      }))
  };
};

/**
 * Convierte un SchoolYear (response) a los valores iniciales del formulario
 */
export const mapSchoolYearToFormValues = (schoolYear: SchoolYear): FormValues => {
  return {
    code: schoolYear.code,
    startDate: schoolYear.startDate,
    endDate: schoolYear.endDate,
    lapses: schoolYear.schoolLapses.map(lapse => ({
      startDate: lapse.startDate,
      endDate: lapse.endDate,
      lapseId: lapse.id || undefined,
      isNew: false,
      isDirty: false,
      schoolCourts: lapse.schoolCourts.map(court => ({
        startDate: court.startDate,
        endDate: court.endDate,
        courtId: court.id || undefined,
        isNew: false,
        isDirty: false
      }))
    })),
    submit: null
  };
}; 