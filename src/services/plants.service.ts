import { ALLOWED_SORT_FIELDS } from '../components/plants/PlantFilters/constants';
import { QueryBuilder } from '../shared/api/QueryBuilder';
import type { PaginatedResponse } from '../types/api';
import type { PaginationParams } from '../types/Pagination';
import type { Plant } from '../types/Plants/Plant';
import type { PlantsSortField } from '../types/Plants/PlantsAllowedSortFields';
import { apiFetch } from './api';

export type PlantFilterParams = {
  name?: string;
  aliases?: string;
  family?: string;
  lifeCycle?: 'annual' | 'biennial' | 'perennial';
  spacingCm?: number;

  sowingMonths?: number | number[];
  sowingMethod?: 'direct' | 'starter';

  soilPh?: number;
  soilAvailableDepthCm?: number;

  lightHoursMin?: number;
  lightType?: 'full_sun' | 'partial_shade' | 'full_shade';

  strategicBenefits?: string;
  rootSystem?: 'fibrous' | 'taproot' | 'adventitious' | 'rhizome';
};

export async function getPlants(
  filters?: PlantFilterParams,
  pagination?: PaginationParams,
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  }
): Promise<PaginatedResponse<Plant>> {
  // narrow sortField to allowed values to prevent invalid API queries
  const sortField: string =
    sort?.field && ALLOWED_SORT_FIELDS.includes(sort.field as PlantsSortField)
      ? sort.field
      : 'identity.name.primary';
  const query = QueryBuilder.create()
    .add('filter[name][eq]', filters?.name)
    .add('filter[aliases][hasAny]', filters?.aliases)
    .add('filter[family][eq]', filters?.family)
    .add('filter[lifeCycle][eq]', filters?.lifeCycle)
    .add('filter[sowingMethod][eq]', filters?.sowingMethod)
    .addArray('filter[sowingMonths][hasAny]', filters?.sowingMonths)
    .add('filter[soilPh][eq]', filters?.soilPh)
    .add('filter[soilAvailableDepthCm][eq]', filters?.soilAvailableDepthCm)
    .add('filter[spacingCm][eq]', filters?.spacingCm)
    .add('filter[lightType][eq]', filters?.lightType)
    .add('filter[lightHoursMin][eq]', filters?.lightHoursMin)
    .add('filter[strategicBenefits][contains]', filters?.strategicBenefits)
    .add('filter[rootSystem][eq]', filters?.rootSystem)
    .add('pagination[page]', pagination?.page)
    .add('pagination[limit]', pagination?.limit)
    .add(`sort[${sortField}]`, sort?.direction ?? 'asc')
    .build();

  return apiFetch(`/api/v1/plants?${query}`) as Promise<
    PaginatedResponse<Plant>
  >;
}

export async function getPlantById(id: string): Promise<Plant> {
  return apiFetch(`/api/v1/plants/${id}`);
}
