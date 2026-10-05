import {
  DEFAULT_PLANT_SORT,
  PLANT_SORT_FIELDS,
  SORT_DIRECTIONS,
  type PlantFilterParams,
  type PlantListRequest,
  type PlantSort
} from '../../../services/plantListQuery';
import type { PaginationParams } from '../../../types/Pagination';
import { PLANT_LIST_URL_PARAMS } from '../../../shared/constants/plantListUrlParams';
import { parsePositiveInt } from '../../../shared/utils/parsePositiveInt';
import { pickAllowed } from '../../../shared/utils/pickAllowed';
import { safeNumber } from '../../../shared/utils/safeNumber';
import {
  isLightType,
  isPlantLifecycle,
  isRootSystem,
  isSowingMethod
} from '../../../components/plants/PlantFilters/utils/plantFilter.utils';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 25;

function parseSort(params: URLSearchParams): PlantSort {
  return {
    field:
      pickAllowed(
        params.getAll(PLANT_LIST_URL_PARAMS.sortField),
        PLANT_SORT_FIELDS
      ) ?? DEFAULT_PLANT_SORT.field,
    direction:
      pickAllowed(
        params.getAll(PLANT_LIST_URL_PARAMS.sortDirection),
        SORT_DIRECTIONS
      ) ?? DEFAULT_PLANT_SORT.direction
  };
}

function parsePagination(params: URLSearchParams): PaginationParams {
  return {
    page: parsePositiveInt(
      params.get(PLANT_LIST_URL_PARAMS.page),
      DEFAULT_PAGE
    ),
    limit: parsePositiveInt(
      params.get(PLANT_LIST_URL_PARAMS.limit),
      DEFAULT_LIMIT
    )
  };
}

function guarded<T extends string>(
  value: string | null,
  isAllowed: (candidate: string) => candidate is T
): T | undefined {
  return value && isAllowed(value) ? value : undefined;
}

function parseSowingMonths(params: URLSearchParams): number[] | undefined {
  const month = safeNumber(params.get(PLANT_LIST_URL_PARAMS.sowingMonth));
  return month !== undefined ? [month] : undefined;
}

function withoutUndefined(filters: PlantFilterParams): PlantFilterParams {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined)
  );
}

function parseFilters(params: URLSearchParams): PlantFilterParams {
  const read = (name: string) => params.get(name);
  return withoutUndefined({
    family: read(PLANT_LIST_URL_PARAMS.family) || undefined,
    identity: read(PLANT_LIST_URL_PARAMS.identity) || undefined,
    lifeCycle: guarded(read(PLANT_LIST_URL_PARAMS.lifeCycle), isPlantLifecycle),
    sowingMethod: guarded(
      read(PLANT_LIST_URL_PARAMS.sowingMethod),
      isSowingMethod
    ),
    lightType: guarded(read(PLANT_LIST_URL_PARAMS.lightType), isLightType),
    rootSystem: guarded(read(PLANT_LIST_URL_PARAMS.rootSystem), isRootSystem),
    sowingMonths: parseSowingMonths(params),
    soilPh: safeNumber(read(PLANT_LIST_URL_PARAMS.soilPh)),
    lightHoursMin: safeNumber(read(PLANT_LIST_URL_PARAMS.lightHoursMin)),
    spacingCm: safeNumber(read(PLANT_LIST_URL_PARAMS.spacingCm)),
    soilAvailableDepthCm: safeNumber(
      read(PLANT_LIST_URL_PARAMS.soilAvailableDepthCm)
    )
  });
}

export function parsePlantListSearchParams(
  params: URLSearchParams
): PlantListRequest {
  return {
    filters: parseFilters(params),
    pagination: parsePagination(params),
    sort: parseSort(params)
  };
}
