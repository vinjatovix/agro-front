import type {
  Plant,
  PlantEcologicalTraits
} from '../../../src/types/Plants/Plant';
import { listPlantsResponse } from './listPlants';

export function buildPlant(overrides: Partial<Plant> = {}): Plant {
  return { ...listPlantsResponse.data[0], ...overrides };
}

export function buildPlantWithEcological(
  ecological: PlantEcologicalTraits
): Plant {
  const plant = buildPlant();
  return { ...plant, traits: { ...plant.traits, ecological } };
}
