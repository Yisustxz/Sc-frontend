import { SelectOption } from "components/SelectField";
import { Subject } from "core/subjects/types";
import BackendError from "exceptions/backend-error";
import { useCallback, useEffect, useState } from "react";
import getAllSubjects from "services/subjects/get-all-subjects";
import { useAppDispatch } from "store";
import { setErrorMessage, setIsLoading } from "store/customizationSlice";

export default function useSubjectsOptions(): SelectOption[] {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const dispatch = useAppDispatch();

  const fetchSubjects = useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const response = await getAllSubjects();
      setSubjects(response);
    } catch (error) {
      if (error instanceof BackendError)
        dispatch(setErrorMessage(error.getMessage()));
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return subjects.map(subject => ({
    label: (subject.id+' -- '+subject.name),
    value: subject.id,
  }));
}
