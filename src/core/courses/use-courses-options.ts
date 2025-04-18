import { SelectOption } from "components/SelectField";
import { Course } from "core/courses/types";
import BackendError from "exceptions/backend-error";
import { useCallback, useEffect, useState } from "react";
import getAllCourses from "services/courses/get-all-courses";
import { useAppDispatch } from "store";
import { setErrorMessage, setIsLoading } from "store/customizationSlice";

export default function useCoursesOptions(): SelectOption[] {
  const [courses, setCourses] = useState<Course[]>([]);
  const dispatch = useAppDispatch();

  const fetchCourses = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const response = await getAllCourses();
      setCourses(response);
    } catch (error) {
      if (error instanceof BackendError)
        dispatch(setErrorMessage(error.getMessage()));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return courses.map(course => ({
    label: course.name,
    value: course.id,
  }));
}
