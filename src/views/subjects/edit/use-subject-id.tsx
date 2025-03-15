import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function useSubjectId() {
  const navigate = useNavigate();
  const params = useParams();

  const [subjectId, setSubjectId] = useState<number | null>(null);
  useEffect(() => {
    if (!params.id || isNaN(params.id as any)) {
      navigate('/subjects');
    }

    setSubjectId(params.id as unknown as number);
  }, [navigate, params.id]);

  return subjectId;
}