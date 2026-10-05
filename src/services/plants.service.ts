import { QueryBuilder } from '../shared/api/QueryBuilder';
import type { PaginatedResponse } from '../types/api';
import type { PaginationParams } from '../types/Pagination';
import type { Plant } from '../types/Plants/Plant';
import { apiFetch } from './api';
import {
  DEFAULT_PLANT_SORT,
  PAGINATION_QUERY_KEYS,
  PLANT_FILTER_QUERY_KEYS,
  sortQueryKey,
  type PlantFilterParams,
  type PlantSort
} from './plantListQuery';

export type { PlantFilterParams };

type FilterValue = PlantFilterParams[keyof PlantFilterParams];

function addFilter(
  query: QueryBuilder,
  key: string,
  value: FilterValue
): QueryBuilder {
  if (Array.isArray(value)) {
    return query.addArray(key, value);
  }
  return query.add(key, value?.trim());
}

function addFilters(
  query: QueryBuilder,
  filters: PlantFilterParams
): QueryBuilder {
  const fields = Object.keys(PLANT_FILTER_QUERY_KEYS) as Array<
    keyof PlantFilterParams
  >;
  return fields.reduce(
    (built, field) =>
      addFilter(built, PLANT_FILTER_QUERY_KEYS[field], filters[field]),
    query
  );
}

function addPagination(
  query: QueryBuilder,
  pagination: Partial<PaginationParams>
): QueryBuilder {
  return query
    .add(PAGINATION_QUERY_KEYS.page, pagination.page)
    .add(PAGINATION_QUERY_KEYS.limit, pagination.limit);
}

export async function getPlants(
  filters: PlantFilterParams = {},
  pagination: Partial<PaginationParams> = {},
  sort: PlantSort = DEFAULT_PLANT_SORT
): Promise<PaginatedResponse<Plant>> {
  const query = addPagination(
    addFilters(QueryBuilder.create(), filters),
    pagination
  )
    .add(sortQueryKey(sort.field), sort.direction)
    .build();

  return apiFetch(`/api/v1/plants?${query}`) as Promise<
    PaginatedResponse<Plant>
  >;
}

export async function getPlantById(id: string): Promise<Plant> {
  return apiFetch(`/api/v1/plants/${id}`);
}
