import { useQuery } from '@tanstack/react-query';
import { getPlants } from '../../../services/plants.service';
import type { Plant } from '../../../types/Plants/Plant';
import type { PaginatedResponse } from '../../../types/api';
import { QUERY_DEFAULTS } from '../../../shared/reactQuery/queryDefaults';
import { plantKeys } from '../../../shared/reactQuery/plantKeys';

type FamilyPlantsResponse = PaginatedResponse<Plant>;

export function useFamilyPlants(familyId?: string) {
  const query = useQuery<FamilyPlantsResponse>({
    queryKey: plantKeys.family(familyId),
    queryFn: () => getPlants({ family: familyId }),
    enabled: Boolean(familyId),
    ...QUERY_DEFAULTS
  });

  return {
    data: query.data?.data ?? [],
    total: query.data?.pagination.totalItems ?? 0,
    loading: query.isLoading,
    error: query.error
  };
}
