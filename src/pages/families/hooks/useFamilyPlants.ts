import { useQuery } from '@tanstack/react-query';
import { getPlants } from '../../../services/plants.service';
import type { Plant } from '../../../types/Plants/Plant';
import type { PaginatedResponse } from '../../../types/api';
import { QUERY_DEFAULTS } from '../../../shared/reactQuery/queryDefaults';

type FamilyPlantsResponse = PaginatedResponse<Plant>;

export function useFamilyPlants(familyId: string) {
  const query = useQuery<FamilyPlantsResponse>({
    queryKey: ['family-plants', familyId],
    queryFn: () => getPlants({ family: familyId }), //TODO: when back implements projected fields, we should request only the necessary fields for this screen
    ...QUERY_DEFAULTS
  });

  return {
    data: query.data?.data ?? [],
    loading: query.isLoading,
    error: query.error
  };
}
