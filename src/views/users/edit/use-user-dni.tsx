import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function useUserDni() {
  const navigate = useNavigate();
  const params = useParams();

  const [id, setUserDni] = useState<string | null>(null);
  useEffect(() => {
    if (!params.id || isNaN(params.id as any)) {
      navigate('/users');
    }

    setUserDni(params.id as unknown as string);
  }, [navigate, params.id]);

  return id;
}