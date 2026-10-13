import { skipToken, useQuery } from '@tanstack/react-query';
import { getFamilyPlants } from '../../../services/plants.service';
import type { FamilyPlantItem } from '../../../types/Plants/Plant';
import type { PaginatedResponse } from '../../../types/api';
import { QUERY_DEFAULTS } from '../../../shared/reactQuery/queryDefaults';
import { plantKeys } from '../../../shared/reactQuery/plantKeys';

type FamilyPlantsResponse = PaginatedResponse<FamilyPlantItem>;

export function useFamilyPlants(familyId?: string) {
  return useQuery<FamilyPlantsResponse>({
    queryKey: plantKeys.family(familyId),
    queryFn: familyId ? () => getFamilyPlants(familyId) : skipToken,
    ...QUERY_DEFAULTS
  });
}
