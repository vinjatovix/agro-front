import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getPlants } from '../../../services/plants.service';
import { QUERY_DEFAULTS } from '../../../shared/reactQuery/queryDefaults';
import type { Plant } from '../../../types/Plants/Plant';
import type { PaginatedResponse } from '../../../types/api';
import type { PlantsSortField } from '../../../types/Plants/PlantsAllowedSortFields';
import { parsePositiveInt } from '../../../shared/utils/parsePositiveInt';
import {
  isPlantLifecycle,
  isSowingMethod,
  isLightType,
  isRootSystem
} from '../../../components/plants/PlantFilters/utils/plantFilter.utils';
import { safeNumber } from '../../../shared/utils/safeNumber';

type SortDirection = 'asc' | 'desc';

export function usePlants() {
  const [params, setParams] = useSearchParams();

  const page = parsePositiveInt(params.get('page'), 1);
  const limit = parsePositiveInt(params.get('limit'), 25);

  const rawSortDirection = params.get('sortDirection');
  const sortDirection: SortDirection =
    rawSortDirection === 'asc' || rawSortDirection === 'desc'
      ? rawSortDirection
      : 'asc';

  const rawLifeCycle = params.get('lifeCycle');
  const rawSowingMethod = params.get('sowingMethod');
  const rawLightType = params.get('lightType');
  const rawRootSystem = params.get('rootSystem');

  const filters = {
    family: params.get('family') || undefined,
    identity: params.get('identity') || undefined,
    lifeCycle:
      rawLifeCycle && isPlantLifecycle(rawLifeCycle) ? rawLifeCycle : undefined,

    sowingMethod:
      rawSowingMethod && isSowingMethod(rawSowingMethod)
        ? rawSowingMethod
        : undefined,

    lightType:
      rawLightType && isLightType(rawLightType) ? rawLightType : undefined,

    rootSystem:
      rawRootSystem && isRootSystem(rawRootSystem) ? rawRootSystem : undefined,

    sowingMonths: (() => {
      const v = safeNumber(params.get('sowingMonth'));
      return v !== undefined ? [v] : undefined;
    })(),

    soilPh: safeNumber(params.get('soilPh')),

    lightHoursMin: safeNumber(params.get('lightHoursMin')),

    spacingCm: safeNumber(params.get('spacingCm')),

    soilAvailableDepthCm: safeNumber(params.get('soilAvailableDepthCm'))
  };

  const pagination = {
    page,
    limit
  };

  const sort = {
    field: 'identity.name.primary' as PlantsSortField,
    direction: sortDirection
  };

  const query = useQuery<PaginatedResponse<Plant>>({
    queryKey: ['plants', { pagination, filters, sort }],
    queryFn: () => getPlants(filters, pagination, sort),
    ...QUERY_DEFAULTS
  });

  function setPage(next: number) {
    setParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('page', String(next));
      return p;
    });
  }

  function setLimit(next: number) {
    setParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('limit', String(next));
      p.set('page', '1');
      return p;
    });
  }

  function setSortDirection(next: SortDirection) {
    setParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('sortDirection', next);
      p.set('page', '1');
      return p;
    });
  }

  return {
    data: query.data?.data ?? [],
    pagination: query.data?.pagination ?? null,
    loading: query.isLoading,
    error: query.error,

    page,
    limit,
    sortDirection,

    setPage,
    setLimit,
    setSortDirection
  };
}
