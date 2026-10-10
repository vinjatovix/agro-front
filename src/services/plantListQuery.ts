import type { PaginationParams } from '../types/Pagination';
import { pickAllowed } from '../shared/utils/pickAllowed';

export const BOOLEAN_FILTER_VALUES = ['true', 'false'] as const;

export type BooleanFilterValue = (typeof BOOLEAN_FILTER_VALUES)[number];

export type PlantFilterParams = {
  identity?: string;
  family?: string;
  lifeCycle?: 'annual' | 'biennial' | 'perennial';
  spacingCm?: string;

  sowingMonths?: number[];
  sowingMethod?: 'direct' | 'starter';

  soilPh?: string;
  soilAvailableDepthCm?: string;

  lightHoursMin?: string;
  lightType?: 'full_sun' | 'partial_shade';

  rootSystem?:
    | 'fibrous'
    | 'taproot'
    | 'adventitious'
    | 'rhizome'
    | 'tuber'
    | 'fasciculate';

  edible?: BooleanFilterValue;
  toxic?: BooleanFilterValue;
};

export const PLANT_SORT_FIELDS = ['name', 'scientificName'] as const;

export const SORT_DIRECTIONS = ['asc', 'desc'] as const;

export type PlantsSortField = (typeof PLANT_SORT_FIELDS)[number];

export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export type PlantSort = {
  readonly field: PlantsSortField;
  readonly direction: SortDirection;
};

export type PlantListRequest = {
  readonly filters: PlantFilterParams;
  readonly pagination: PaginationParams;
  readonly sort: PlantSort;
};

export const DEFAULT_PLANT_SORT: PlantSort = {
  field: 'name',
  direction: 'asc'
};

export const PLANT_FILTER_QUERY_KEYS: Record<keyof PlantFilterParams, string> =
  {
    identity: 'filter[identity][contains]',
    family: 'filter[family][eq]',
    lifeCycle: 'filter[lifeCycle][eq]',
    edible: 'filter[edible][eq]',
    toxic: 'filter[toxic][eq]',
    sowingMethod: 'filter[sowingMethod][eq]',
    sowingMonths: 'filter[sowingMonths][hasAny]',
    soilPh: 'filter[soilPh][eq]',
    soilAvailableDepthCm: 'filter[soilAvailableDepthCm][eq]',
    spacingCm: 'filter[spacingCm][eq]',
    lightType: 'filter[lightType][eq]',
    lightHoursMin: 'filter[lightHoursMin][eq]',
    rootSystem: 'filter[rootSystem][eq]'
  };

export const PAGINATION_QUERY_KEYS = {
  page: 'pagination[page]',
  limit: 'pagination[limit]'
} as const;

export const PAGINATION_LIMIT_MAX = 100;

export const PLANT_FIELDS_QUERY_KEY = 'fields[plants]';

export const PLANT_FIELDS = [
  'id',
  'identity',
  'traits',
  'phenology',
  'knowledge',
  'metadata',
  'status',
  'deletedAt',
  'version'
] as const;

export type PlantField = (typeof PLANT_FIELDS)[number];

export const PLANT_LIST_FIELDS: readonly PlantField[] = [
  'identity',
  'traits',
  'knowledge',
  'status'
];

export const FAMILY_PLANTS_FIELDS: readonly PlantField[] = [
  'identity',
  'status'
];

export function sortQueryKey(field: PlantsSortField): string {
  return `sort[${field}]`;
}

export function isPlantsSortField(value: string): value is PlantsSortField {
  return (PLANT_SORT_FIELDS as readonly string[]).includes(value);
}

export function isSortDirection(value: string): value is SortDirection {
  return (SORT_DIRECTIONS as readonly string[]).includes(value);
}

export function parseBooleanFilter(
  values: readonly string[]
): BooleanFilterValue | undefined {
  return pickAllowed(values, BOOLEAN_FILTER_VALUES);
}
