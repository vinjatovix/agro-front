import {
  LIFE_CYCLES,
  SOWING_METHODS,
  LIGHT_TYPES,
  ROOT_SYSTEMS
} from '../constants';

export const TOGGLE_FILTERS = [
  {
    key: 'lifeCycle',
    label: 'Lifecycle',
    options: LIFE_CYCLES
  },
  {
    key: 'sowingMethod',
    label: 'Sowing method',
    options: SOWING_METHODS
  },
  {
    key: 'lightType',
    label: 'Light type',
    options: LIGHT_TYPES
  },
  {
    key: 'rootSystem',
    label: 'Root system',
    options: ROOT_SYSTEMS
  }
] as const;

export const TEXT_FILTERS = [
  {
    key: 'aliases',
    label: 'Alias'
  },
  {
    key: 'strategicBenefits',
    label: 'Strategic benefits'
  }
] as const;

export const SLIDER_FILTERS = [
  {
    key: 'soilPh',
    label: 'Soil pH',
    min: 4,
    max: 9,
    step: 0.1
  },
  {
    key: 'lightHoursMin',
    label: 'Light hours min',
    min: 0,
    max: 16,
    step: 1
  },
  {
    key: 'spacingCm',
    label: 'Spacing (cm)',
    min: 5,
    max: 200,
    step: 5
  },
  {
    key: 'soilAvailableDepthCm',
    label: 'Soil depth available (cm)',
    min: 10,
    max: 200,
    step: 5
  }
] as const;
