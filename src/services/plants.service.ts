import { QueryBuilder } from '../shared/api/QueryBuilder';
import type { PaginatedResponse } from '../types/api';
import type { PaginationParams } from '../types/Pagination';
import type {
  FamilyPlantItem,
  Plant,
  PlantListItem
} from '../types/Plants/Plant';
import { apiFetch } from './api';
import { PAGINATION_QUERY_KEYS } from './listQuery';
import {
  DEFAULT_PLANT_SORT,
  FAMILY_PLANTS_FIELDS,
  PLANT_FIELDS_QUERY_KEY,
  PLANT_FILTER_QUERY_KEYS,
  PLANT_LIST_FIELDS,
  sortQueryKey,
  type PlantField,
  type PlantFilterParams,
  type PlantListRequest,
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

type PlantsQuery = {
  readonly filters?: PlantFilterParams;
  readonly pagination?: Partial<PaginationParams>;
  readonly sort?: PlantSort;
};

function buildPlantsQuery(
  { filters = {}, pagination = {}, sort = DEFAULT_PLANT_SORT }: PlantsQuery,
  fields: readonly PlantField[]
): string {
  return addPagination(addFilters(QueryBuilder.create(), filters), pagination)
    .add(sortQueryKey(sort.field), sort.direction)
    .add(PLANT_FIELDS_QUERY_KEY, fields.join(','))
    .build();
}

export async function getFamilyPlants(
  familyId: string
): Promise<PaginatedResponse<FamilyPlantItem>> {
  const query = buildPlantsQuery(
    { filters: { family: familyId } },
    FAMILY_PLANTS_FIELDS
  );

  return apiFetch(`/api/v1/plants?${query}`);
}

export async function getPlantList(
  request: PlantListRequest
): Promise<PaginatedResponse<PlantListItem>> {
  const query = buildPlantsQuery(request, PLANT_LIST_FIELDS);

  return apiFetch(`/api/v1/plants?${query}`);
}

export const PLANT_INCLUDE_QUERY_KEY = 'include';
export const PLANT_INCLUDES = {
  family: 'family'
} as const;

export async function getPlantById(id: string): Promise<Plant> {
  const query = QueryBuilder.create()
    .add(PLANT_INCLUDE_QUERY_KEY, PLANT_INCLUDES.family)
    .build();

  return apiFetch(`/api/v1/plants/${id}?${query}`);
}
