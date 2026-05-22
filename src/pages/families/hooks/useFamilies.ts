import { useQuery } from '@tanstack/react-query';
import { getFamilies } from '../../../services/families.service';
import type { Family } from '../../../types/Family';
import type { PaginatedResponse } from '../../../types/api';
import { QUERY_DEFAULTS } from '../../../shared/reactQuery/queryDefaults';

type FamiliesResponse = PaginatedResponse<Family>;

export function useFamilies() {
  const query = useQuery<FamiliesResponse>({
    queryKey: ['families'],
    queryFn: getFamilies,
    ...QUERY_DEFAULTS
  });

  return {
    families: query.data?.data ?? [],
    loading: query.isLoading,
    error: query.error
  };
}
