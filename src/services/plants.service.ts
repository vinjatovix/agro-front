import { QueryBuilder } from '../shared/api/QueryBuilder';
import type { PaginatedResponse } from '../types/api';
import type { PaginationParams } from '../types/Pagination';
import type { Plant } from '../types/Plants/Plant';
import { apiFetch } from './api';
import { DEFAULT_SORT_FIELD, isPlantsSortField } from './plantsSortFields';

export type PlantFilterParams = {
  identity?: string;
  family?: string;
  lifeCycle?: 'annual' | 'biennial' | 'perennial';
  spacingCm?: number;

  sowingMonths?: number | number[];
  sowingMethod?: 'direct' | 'starter';

  soilPh?: number;
  soilAvailableDepthCm?: number;

  lightHoursMin?: number;
  lightType?: 'full_sun' | 'partial_shade';

  rootSystem?:
    | 'fibrous'
    | 'taproot'
    | 'adventitious'
    | 'rhizome'
    | 'tuber'
    | 'fasciculate';
};

type PlantSort = {
  field: string;
  direction: 'asc' | 'desc';
};

function resolveSortField(sort?: PlantSort): string {
  return sort && isPlantsSortField(sort.field)
    ? sort.field
    : DEFAULT_SORT_FIELD;
}

function addFilters(
  query: QueryBuilder,
  filters: PlantFilterParams
): QueryBuilder {
  return query
    .add('filter[identity][contains]', filters.identity?.trim())
    .add('filter[family][eq]', filters.family)
    .add('filter[lifeCycle][eq]', filters.lifeCycle)
    .add('filter[sowingMethod][eq]', filters.sowingMethod)
    .addArray('filter[sowingMonths][hasAny]', filters.sowingMonths)
    .add('filter[soilPh][eq]', filters.soilPh)
    .add('filter[soilAvailableDepthCm][eq]', filters.soilAvailableDepthCm)
    .add('filter[spacingCm][eq]', filters.spacingCm)
    .add('filter[lightType][eq]', filters.lightType)
    .add('filter[lightHoursMin][eq]', filters.lightHoursMin)
    .add('filter[rootSystem][eq]', filters.rootSystem);
}

function addPagination(
  query: QueryBuilder,
  pagination: Partial<PaginationParams>
): QueryBuilder {
  return query
    .add('pagination[page]', pagination.page)
    .add('pagination[limit]', pagination.limit);
}

export async function getPlants(
  filters: PlantFilterParams = {},
  pagination: Partial<PaginationParams> = {},
  sort?: PlantSort
): Promise<PaginatedResponse<Plant>> {
  const query = addPagination(
    addFilters(QueryBuilder.create(), filters),
    pagination
  )
    .add(`sort[${resolveSortField(sort)}]`, sort?.direction ?? 'asc')
    .build();

  return apiFetch(`/api/v1/plants?${query}`) as Promise<
    PaginatedResponse<Plant>
  >;
}

export async function getPlantById(id: string): Promise<Plant> {
  return apiFetch(`/api/v1/plants/${id}`);
}
