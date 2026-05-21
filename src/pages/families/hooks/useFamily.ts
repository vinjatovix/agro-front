import { useQuery } from '@tanstack/react-query';
import { getFamilyById } from '../../../services/families.service';

export function useFamily(id: string) {
  return useQuery({
    queryKey: ['family', id],
    queryFn: () => getFamilyById(id),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7
  });
}
