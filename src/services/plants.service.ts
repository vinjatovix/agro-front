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
  const query = new URLSearchParams();

  if (filters?.name) {
    query.append('filter[name][eq]', filters.name);
  }
  if (filters?.aliases) {
    query.append('filter[aliases][hasAny]', filters.aliases);
  }

  if (filters?.family) {
    query.append('filter[family][eq]', filters.family);
  }

  if (filters?.lifeCycle) {
    query.append('filter[lifeCycle][eq]', filters.lifeCycle);
  }

  if (filters?.sowingMethod) {
    query.append('filter[sowingMethod][eq]', filters.sowingMethod);
  }

  if (filters?.sowingMonths !== undefined) {
    const months = Array.isArray(filters.sowingMonths)
      ? filters.sowingMonths
      : [filters.sowingMonths];
    if (months.length) {
      query.append('filter[sowingMonths][hasAny]', months.join(','));
    }
  }

  if (filters?.soilPh !== undefined) {
    query.append('filter[soilPh][eq]', String(filters.soilPh));
  }

  if (filters?.soilAvailableDepthCm !== undefined) {
    query.append(
      'filter[soilAvailableDepthCm][eq]',
      String(filters.soilAvailableDepthCm)
    );
  }

  if (filters?.lightHoursMin !== undefined) {
    query.append('filter[lightHoursMin][eq]', String(filters.lightHoursMin));
  }

  if (filters?.strategicBenefits) {
    query.append(
      'filter[strategicBenefits][contains]',
      filters.strategicBenefits
    );
  }

  if (filters?.rootSystem) {
    query.append('filter[rootSystem][eq]', filters.rootSystem);
  }

  if (pagination?.page) {
    query.append('page', String(pagination.page));
  }
  if (pagination?.limit) {
    query.append('limit', String(pagination.limit));
  }

  return apiFetch(`/api/v1/plants?${query.toString()}`) as Promise<
    PaginatedResponse<Plant>
  >;
}

export async function getPlantById(id: string) {
  return apiFetch(`/api/v1/plants/${id}`) as Promise<Plant>;
}
