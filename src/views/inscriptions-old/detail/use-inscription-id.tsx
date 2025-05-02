import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function useInscriptionId() {
  const navigate = useNavigate();
  const params = useParams();

  const [inscriptionId, setInscriptionId] = useState<number | null>(null);
  
  useEffect(() => {
    if (!params.id || isNaN(params.id as any)) {
      navigate('/inscriptions');
    }

    setInscriptionId(parseInt(params.id as string));
  }, [navigate, params.id]);

  return inscriptionId;
} 