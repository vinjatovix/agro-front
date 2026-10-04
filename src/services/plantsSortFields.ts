import type { PlantsSortField } from '../types/Plants/PlantsAllowedSortFields';

export const ALLOWED_SORT_FIELDS: readonly PlantsSortField[] = [
  'name',
  'scientificName'
];

export const DEFAULT_SORT_FIELD: PlantsSortField = 'name';

export function isPlantsSortField(value: string): value is PlantsSortField {
  return (ALLOWED_SORT_FIELDS as readonly string[]).includes(value);
}
