import type { Plant } from '../../../src/types/Plants/Plant';
import { listPlantsResponse } from './listPlants';

export function buildPlant(overrides: Partial<Plant> = {}): Plant {
  return { ...listPlantsResponse.data[0], ...overrides };
}
