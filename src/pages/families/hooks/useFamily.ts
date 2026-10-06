import { useQuery } from '@tanstack/react-query';
import { getFamilyById } from '../../../services/families.service';
import { QUERY_DEFAULTS } from '../../../shared/reactQuery/queryDefaults';

export function useFamily(id?: string) {
  return useQuery({
    queryKey: ['family', id],
    queryFn: () => getFamilyById(id ?? ''),
    enabled: Boolean(id),
    ...QUERY_DEFAULTS
  });
}
