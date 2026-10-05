import { useQuery } from '@tanstack/react-query';
import { getPlantById } from '../../../services/plants.service';
import { plantKeys } from '../../../shared/reactQuery/plantKeys';
import { QUERY_DEFAULTS } from '../../../shared/reactQuery/queryDefaults';

export function usePlant(id: string) {
  return useQuery({
    queryKey: plantKeys.detail(id),
    queryFn: () => getPlantById(id),
    ...QUERY_DEFAULTS
  });
}
