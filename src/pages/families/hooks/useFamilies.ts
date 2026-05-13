import { useEffect, useState } from 'react';
import { getFamilies } from '../../../services/families.service';
import type { Family } from '../../../types/Family';

export function useFamilies() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getFamilies().then((res) => {
      if (!mounted) return;

      setFamilies(res.data ?? res);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return {
    families,
    loading
  };
}
