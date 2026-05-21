import { useQuery } from '@tanstack/react-query';
import { getFamilies } from '../../../services/families.service';
import type { Family } from '../../../types/Family';
import type { PaginatedResponse } from '../../../types/api';

type FamiliesResponse = PaginatedResponse<Family>;

export function useFamilies() {
  const query = useQuery<FamiliesResponse>({
    queryKey: ['families'],
    queryFn: getFamilies,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7
  });

  return {
    families: query.data?.data ?? [],
    loading: query.isLoading,
    error: query.error
  };
}
