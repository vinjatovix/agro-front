import {
  LIFE_CYCLES,
  SOWING_METHODS,
  LIGHT_TYPES,
  ROOT_SYSTEMS
} from '../constants';

export const TOGGLE_FILTERS = [
  {
    key: 'lifeCycle',
    labelKey: 'plant.filters.lifeCycle',
    options: LIFE_CYCLES
  },
  {
    key: 'sowingMethod',
    labelKey: 'plant.filters.sowingMethod',
    options: SOWING_METHODS
  },
  {
    key: 'lightType',
    labelKey: 'plant.filters.lightType',
    options: LIGHT_TYPES
  },
  {
    key: 'rootSystem',
    labelKey: 'plant.filters.rootSystem',
    options: ROOT_SYSTEMS
  }
] as const;

export const TEXT_FILTERS = [
  {
    key: 'identity',
    labelKey: 'plant.filters.search_label',
    placeholder: 'plant.filters.search_placeholder'
  }
] as const;

export const SLIDER_FILTERS = [
  {
    key: 'soilPh',
    labelKey: 'plant.filters.soilPh',
    min: 4,
    max: 9,
    step: 0.1
  },
  {
    key: 'lightHoursMin',
    labelKey: 'plant.filters.lightHoursMin',
    min: 0,
    max: 16,
    step: 1
  },
  {
    key: 'spacingCm',
    labelKey: 'plant.filters.spacingCm',
    min: 5,
    max: 200,
    step: 5
  },
  {
    key: 'soilAvailableDepthCm',
    labelKey: 'plant.filters.soilAvailableDepthCm',
    min: 10,
    max: 200,
    step: 5
  }
] as const;
