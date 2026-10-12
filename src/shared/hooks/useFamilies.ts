import { useQuery } from '@tanstack/react-query';
import { getFamilyList } from '../../services/families.service';
import type { FamilyListItem } from '../../types/Family';
import { familyKeys } from '../reactQuery/familyKeys';
import { QUERY_DEFAULTS } from '../reactQuery/queryDefaults';

export function useFamilies() {
  const query = useQuery({
    queryKey: familyKeys.list(),
    queryFn: getFamilyList,
    ...QUERY_DEFAULTS
  });

  const data: FamilyListItem[] = query.data ?? [];

  return {
    data,
    loading: query.isLoading,
    error: query.error
  };
}
