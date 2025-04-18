import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function useSubjectId() {
  const navigate = useNavigate();
  const params = useParams();

  const [subjectId, setSubjectId] = useState<string | null>(null);
  useEffect(() => {
    if (!params.id || isNaN(params.id as any)) {
      navigate('/courses');
    }

    setSubjectId(params.id as unknown as string);
  }, [navigate, params.id]);

  return subjectId;
}