import { useQuery } from '@tanstack/react-query';
import { getPlantById } from '../../../services/plants.service';
import { QUERY_DEFAULTS } from '../../../shared/reactQuery/queryDefaults';

export function usePlant(id: string) {
  return useQuery({
    queryKey: ['plant', id],
    queryFn: () => getPlantById(id),
    ...QUERY_DEFAULTS
  });
}
