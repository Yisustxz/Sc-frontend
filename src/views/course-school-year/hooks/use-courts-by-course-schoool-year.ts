import { useMemo } from 'react'
// material-ui
import { CourseSchoolYear } from 'core/course-school-year/types'
import { SchoolCourt } from 'core/school-year/types'

export default function useCourtsByCourseSchoolYear(courseSchoolYear: CourseSchoolYear | null) {
  return useMemo(() => {
    if (!courseSchoolYear) {
      return [];
    }

    const schoolYear = courseSchoolYear.schoolYear;
    if (!schoolYear) {
      return [];
    }

    const schoolLapses = schoolYear.schoolLapses;
    if (!schoolLapses) {
      return [];
    }

    const schoolCourts: SchoolCourt[] = [];

    schoolLapses.forEach((schoolLapse) => {
      const courts = schoolLapse.schoolCourts; 
      courts.forEach((court) => {
        schoolCourts.push(court);
      });
    });

    return schoolCourts;
  }, [courseSchoolYear])
}

export function useCourtsOptionsByCourseSchoolYear(courseSchoolYear: CourseSchoolYear | null): CourtOption[] {
  return useMemo(() => {
    if (!courseSchoolYear) {
      return [];
    }

    const schoolYear = courseSchoolYear.schoolYear;
    if (!schoolYear) {
      return [];
    }

    const schoolLapses = schoolYear.schoolLapses;
    if (!schoolLapses) {
      return [];
    }

    const schoolCourts: CourtOption[] = [];

    schoolLapses.forEach((schoolLapse, indexLapse) => {
      const courts = schoolLapse.schoolCourts; 
        courts.forEach((court, indexCourt) => {
        if (court.id) {
            const lapseNumber = schoolLapse.lapseNumber || indexLapse + 1;
            const courtNumber = court.courtNumber || indexCourt + 1;
            schoolCourts.push({
                label: `Lapso #${lapseNumber} - Corte #${courtNumber}`,
                value: court.id,
            });
        } else {
            console.log('Error: No se encontró el id del corte', court);
        }
      });
    });

    return schoolCourts;
  }, [courseSchoolYear])
}

export interface CourtOption {
  label: string;
  value: number | null;
}


export type SetCourtExpanded = (courtId: number, isExpanded: boolean) => void;
export type SetLapseExpanded = (lapseId: number, isExpanded: boolean) => void;