import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPlants } from '../../../services/plants.service';

import type {
  LightType,
  Plant,
  PlantLifecycle,
  RootSystem,
  SowingMethod
} from '../../../types/Plants/Plant';

import type { PaginationResult } from '../../../types/Pagination';
import { ALLOWED_SORT_FIELDS } from '../../../components/plants/PlantFilters/constants';
import type { PlantsSortField } from '../../../types/Plants/PlantsAllowedSortFields';

type SortDirection = 'asc' | 'desc';

function isSortField(value: string): value is PlantsSortField {
  return ALLOWED_SORT_FIELDS.includes(value as PlantsSortField);
}

export function usePlants(search: string) {
  const [params, setParams] = useSearchParams();

  const page = Number(params.get('page') ?? 1);
  const limit = Number(params.get('limit') ?? 25);

  const rawSortField = params.get('sortField');
  const sortField: PlantsSortField = isSortField(rawSortField ?? '')
    ? (rawSortField as PlantsSortField)
    : 'identity.name.primary';

  const sortDirection = (params.get('sortDirection') as SortDirection) ?? 'asc';

  const [plants, setPlants] = useState<Plant[]>([]);
  const [pagination, setPagination] = useState<PaginationResult | null>(null);
  const [loading, setLoading] = useState(true);

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

  function setSortField(next: PlantsSortField) {
    setParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('sortField', next);
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

  const paramsString = params.toString();

  useEffect(() => {
    async function loadPlants() {
      try {
        setLoading(true);

        const response = await getPlants(
          {
            family: params.get('family') || undefined,

            lifeCycle: params.get('lifeCycle') as PlantLifecycle | undefined,
            sowingMethod: params.get('sowingMethod') as
              | SowingMethod
              | undefined,
            lightType: params.get('lightType') as LightType | undefined,
            rootSystem: params.get('rootSystem') as RootSystem | undefined,

            sowingMonths: params.get('sowingMonth')
              ? [Number(params.get('sowingMonth'))]
              : undefined,

            soilPh: params.get('soilPh')
              ? Number(params.get('soilPh'))
              : undefined,

            lightHoursMin: params.get('lightHoursMin')
              ? Number(params.get('lightHoursMin'))
              : undefined,

            spacingCm: params.get('spacingCm')
              ? Number(params.get('spacingCm'))
              : undefined,

            soilAvailableDepthCm: params.get('soilAvailableDepthCm')
              ? Number(params.get('soilAvailableDepthCm'))
              : undefined,

            aliases: params.get('aliases') || undefined,

            strategicBenefits: params.get('strategicBenefits') || undefined
          },
          {
            page,
            limit
          },
          {
            field: sortField,
            direction: sortDirection
          }
        );

        setPlants(response.data);
        setPagination(response.pagination);
      } finally {
        setLoading(false);
      }
    }

    loadPlants();
  }, [paramsString, page, limit, sortField, sortDirection]);

  const filteredPlants = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return plants;

    return plants.filter((plant) => {
      const primary = plant.identity.name.primary.toLowerCase();
      const aliases =
        plant.identity.name.aliases?.join(' ').toLowerCase() ?? '';
      const scientific = plant.identity.scientificName?.toLowerCase() ?? '';

      return (
        primary.includes(q) || aliases.includes(q) || scientific.includes(q)
      );
    });
  }, [plants, search]);

  return {
    plants: filteredPlants,
    loading,
    pagination,

    page,
    limit,

    sortField,
    sortDirection,

    setPage,
    setLimit,
    setSortField,
    setSortDirection
  };
}
