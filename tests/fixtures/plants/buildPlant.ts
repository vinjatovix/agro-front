import type { PlantFamilyRef } from '../../../src/types/FamilySummary';
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

export function buildPlantWithFamily(family: PlantFamilyRef): Plant {
  const plant = buildPlant();
  return { ...plant, identity: { ...plant.identity, family } };
}
