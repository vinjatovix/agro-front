import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getPlantList } from '../../../services/plants.service';
import type {
  PlantsSortField,
  SortDirection
} from '../../../services/plantListQuery';
import { QUERY_DEFAULTS } from '../../../shared/reactQuery/queryDefaults';
import { plantKeys } from '../../../shared/reactQuery/plantKeys';
import { PLANT_LIST_URL_PARAMS } from '../../../shared/constants/plantListUrlParams';
import type { PlantListItem } from '../../../types/Plants/Plant';
import type { PaginatedResponse } from '../../../types/api';
import { parsePlantListSearchParams } from '../utils/parsePlantListSearchParams';

export function usePlants() {
  const [params, setParams] = useSearchParams();
  const request = parsePlantListSearchParams(params);

  const query = useQuery<PaginatedResponse<PlantListItem>>({
    queryKey: plantKeys.list(request),
    queryFn: () => getPlantList(request),
    ...QUERY_DEFAULTS
  });

  function updateParams(key: string, value: string) {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(key, value);
      next.delete(PLANT_LIST_URL_PARAMS.page);
      return next;
    });
  }

  function setPage(page: number) {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(PLANT_LIST_URL_PARAMS.page, String(page));
      return next;
    });
  }

  function setLimit(limit: number) {
    updateParams(PLANT_LIST_URL_PARAMS.limit, String(limit));
  }

  function setSortField(field: PlantsSortField) {
    updateParams(PLANT_LIST_URL_PARAMS.sortField, field);
  }

  function setSortDirection(direction: SortDirection) {
    updateParams(PLANT_LIST_URL_PARAMS.sortDirection, direction);
  }

  return {
    query,
    request,
    setPage,
    setLimit,
    setSortField,
    setSortDirection
  };
}
