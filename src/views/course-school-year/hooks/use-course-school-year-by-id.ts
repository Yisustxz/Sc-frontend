import { useCallback, useEffect, useState } from 'react'
// material-ui
import BackendError from 'exceptions/backend-error'
import { setIsLoading, setErrorMessage } from 'store/customizationSlice'
import { useAppDispatch } from '../../../store/index'
import { CourseSchoolYear } from 'core/course-school-year/types'
import getCourseSchoolYear from 'services/course-school-year/get-course-school-year'
import school from '../../../menu-items/school';
import { SchoolCourt, SchoolLapse, SchoolYear } from 'core/school-year/types'

export default function useCourseSchoolYearById(id: number | null) {
  const dispatch = useAppDispatch()
  const [courseSchoolYear, setCourseSchoolYear] = useState<CourseSchoolYear | null>(null)
  const [withExpanded, setExpanded] = useState<CourseSchoolYear | null>(null);

  const fetchCourseSchoolYear = useCallback(
    async (id: number) => {
      try {
        dispatch(setIsLoading(true))
        const response = await getCourseSchoolYear(id)
        setCourseSchoolYear(response);
        setExpanded(getWithIsExpandedFalse(response));
      } catch (error) {
        if (error instanceof BackendError)
          dispatch(setErrorMessage(error.getMessage()))
      } finally {
        dispatch(setIsLoading(false))
      }
    },
    [dispatch]
  )

  useEffect(() => {
    if (id) fetchCourseSchoolYear(id)
  }, [fetchCourseSchoolYear, id])

  const setLapseExpanded = useSetLapseExpanded(withExpanded, setExpanded)
  const setCourtExpanded = useSetCourtExpanded(withExpanded, setExpanded)

  const setExpandAll = useSetExpandAll(withExpanded, setExpanded)
  const setCollapseAll = useSetCollapseAll(withExpanded, setExpanded)

  return {
    courseSchoolYear: withExpanded,
    setLapseExpanded,
    setCourtExpanded,
    setExpandAll,
    setCollapseAll
  };
}

function useSetExpandAll(courseSchoolYearExpanded: CourseSchoolYear | null, setExpanded: (courseSchoolYearExpanded: CourseSchoolYear | null) => void) {
  return useCallback(() => {
    if (!courseSchoolYearExpanded) {
      return;
    }

    const lapses = courseSchoolYearExpanded.schoolYear.schoolLapses.map(lapse => {
      return {
        ...lapse,
        isExpanded: true,
        schoolCourts: lapse.schoolCourts.map(court => {
          return {
            ...court,
            isExpanded: true
          }
        })
      }
    });
    
    const newExpanded: CourseSchoolYear = {
      ...courseSchoolYearExpanded,
      schoolYear: {
        ...courseSchoolYearExpanded.schoolYear,
        schoolLapses: lapses
      }
    }

    setExpanded(newExpanded);
  }, [courseSchoolYearExpanded, setExpanded])
}

function useSetCollapseAll(courseSchoolYearExpanded: CourseSchoolYear | null, setExpanded: (courseSchoolYearExpanded: CourseSchoolYear | null) => void) {
  return useCallback(() => {
    if (!courseSchoolYearExpanded) {
      return;
    }

    const lapses = courseSchoolYearExpanded.schoolYear.schoolLapses.map(lapse => {
      return {
        ...lapse,
        isExpanded: false
      }
    })
    
    const newExpanded: CourseSchoolYear = {
      ...courseSchoolYearExpanded,
      schoolYear: {
        ...courseSchoolYearExpanded.schoolYear,
        schoolLapses: lapses
      }
    } 

    setExpanded(newExpanded); 
  }, [courseSchoolYearExpanded, setExpanded])
}

function useSetLapseExpanded(courseSchoolYearExpanded: CourseSchoolYear | null, setExpanded: (courseSchoolYearExpanded: CourseSchoolYear | null) => void) {
  return useCallback((lapseId: number, isExpanded: boolean) => {
    if (!courseSchoolYearExpanded) {
      return;
    }

    const lapses = courseSchoolYearExpanded.schoolYear.schoolLapses;
    const lapseFounded = lapses.find(lapse => lapse.id === lapseId);
    if (!lapseFounded) {
      return;
    }

    const newExpanded: CourseSchoolYear = {
      ...courseSchoolYearExpanded,
      schoolYear: {
        ...courseSchoolYearExpanded.schoolYear,
        schoolLapses: lapses.map((lapse: SchoolLapse) => {
          if (lapse.id === lapseFounded.id) {
            return {
              ...lapse,
              isExpanded: isExpanded
            }
          }

          return lapse;
        })
      }
    }

    setExpanded(newExpanded);
  }, [courseSchoolYearExpanded, setExpanded])
}

function useSetCourtExpanded(courseSchoolYearExpanded: CourseSchoolYear | null, setExpanded: (courseSchoolYearExpanded: CourseSchoolYear | null) => void) {
  return useCallback((courtId: number, isExpanded: boolean) => {
    if (!courseSchoolYearExpanded) {
      return;
    }

    const lapses = courseSchoolYearExpanded.schoolYear.schoolLapses;
    const lapseWithCourtFounded = lapses.find(lapse => {
      const courtFounded = lapse.schoolCourts.find(court => court.id === courtId)
      if (!courtFounded) {
        return false;
      }

      return true;
    });
    if (!lapseWithCourtFounded) {
      return;
    }

    const courts = lapseWithCourtFounded.schoolCourts;
    const courtFounded = courts.find(court => court.id === courtId);
    if (!courtFounded) {
      return;
    }

    const newExpanded: CourseSchoolYear = {
      ...courseSchoolYearExpanded,
      schoolYear: {
        ...courseSchoolYearExpanded.schoolYear,
        schoolLapses: lapses.map((lapse: SchoolLapse) => {
          return {
            ...lapse,
            schoolCourts: lapse.schoolCourts.map((court: SchoolCourt) => {
              if (court.id === courtFounded.id) {
                return {
                  ...court,
                  isExpanded: isExpanded
                }
              }

              return court;
            })
          }
        })
      }
    }

    setExpanded(newExpanded);
  }, [courseSchoolYearExpanded, setExpanded])
}

function getWithIsExpandedFalse(courseSchoolYear: CourseSchoolYear) {

  if (!courseSchoolYear.schoolYear) {
    return courseSchoolYear;
  }

  console.log('entry courseSchoolYear', courseSchoolYear)

  courseSchoolYear.schoolYear.schoolLapses?.forEach((schoolLapse: SchoolLapse) => {
    schoolLapse.isExpanded = false
    schoolLapse.schoolCourts?.forEach((schoolCourt: SchoolCourt) => {
      schoolCourt.isExpanded = false
    })
  })

  return courseSchoolYear;
}
