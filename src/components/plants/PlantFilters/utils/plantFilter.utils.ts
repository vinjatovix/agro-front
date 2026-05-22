import type {
  LightType,
  PlantLifecycle,
  RootSystem,
  SowingMethod
} from '../../../../types/Plants/Plant';
import {
  LIFE_CYCLES,
  LIGHT_TYPES,
  ROOT_SYSTEMS,
  SOWING_METHODS
} from '../constants';

export function isPlantLifecycle(value: string): value is PlantLifecycle {
  return LIFE_CYCLES.includes(value as PlantLifecycle);
}

export function isSowingMethod(value: string): value is SowingMethod {
  return SOWING_METHODS.includes(value as SowingMethod);
}

export function isLightType(value: string): value is LightType {
  return LIGHT_TYPES.includes(value as LightType);
}

export function isRootSystem(value: string): value is RootSystem {
  return ROOT_SYSTEMS.includes(value as RootSystem);
}
