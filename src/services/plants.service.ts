import { QueryBuilder } from '../shared/api/QueryBuilder';
import type { PaginatedResponse } from '../types/api';
import type { PaginationParams } from '../types/Pagination';
import type { Plant } from '../types/Plant';
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
  pagination?: PaginationParams
) {
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
    .add('page', pagination?.page)
    .add('limit', pagination?.limit)
    .build();

  return apiFetch(`/api/v1/plants?${query}`) as Promise<
    PaginatedResponse<Plant>
  >;
}

export async function getPlantById(id: string) {
  return apiFetch(`/api/v1/plants/${id}`) as Promise<Plant>;
}
