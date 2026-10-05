import { FILTER_TEXT_MAX_LENGTH } from '../../../../shared/constants/filterText';
import { iconsMap } from '../../../../shared/constants/iconsMap';
import type { ValueGroup } from '../../../../i18n/core/tValue';
import {
  LIFE_CYCLES,
  SOWING_METHODS,
  LIGHT_TYPES,
  ROOT_SYSTEMS
} from '../constants';

export const TOGGLE_FILTERS = [
  {
    icon: iconsMap['recycle'],
    key: 'lifeCycle',
    labelKey: 'plant.filters.lifeCycle',
    valuesGroup: 'plant.filters.lifeCycleValues' satisfies ValueGroup,
    options: LIFE_CYCLES
  },
  {
    icon: iconsMap['sowing'],
    key: 'sowingMethod',
    labelKey: 'plant.filters.sowingMethod',
    valuesGroup: 'plant.filters.sowingMethodValues' satisfies ValueGroup,
    options: SOWING_METHODS
  },
  {
    icon: iconsMap['sun'],
    key: 'lightType',
    labelKey: 'plant.filters.lightType',
    valuesGroup: 'plant.filters.lightTypeValues' satisfies ValueGroup,
    options: LIGHT_TYPES
  },
  {
    icon: iconsMap['rootSystem'],
    key: 'rootSystem',
    labelKey: 'plant.filters.rootSystem',
    valuesGroup: 'plant.filters.rootSystemValues' satisfies ValueGroup,
    options: ROOT_SYSTEMS
  }
] as const;

export const BOOLEAN_FILTER_ANY = 'any';

export const BOOLEAN_FILTERS = [
  {
    icon: iconsMap['edible'],
    key: 'edible',
    labelKey: 'plant.filters.edible',
    valuesGroup: 'plant.filters.booleanValues' satisfies ValueGroup,
    options: [BOOLEAN_FILTER_ANY, 'true', 'false']
  },
  {
    icon: iconsMap['toxic'],
    key: 'toxic',
    labelKey: 'plant.filters.toxic',
    valuesGroup: 'plant.filters.booleanValues' satisfies ValueGroup,
    options: [BOOLEAN_FILTER_ANY, 'true', 'false']
  }
] as const;

export const TEXT_FILTERS = [
  {
    icon: iconsMap['google'],
    key: 'identity',
    labelKey: 'plant.filters.search_label',
    placeholder: 'plant.filters.search_placeholder',
    maxLength: FILTER_TEXT_MAX_LENGTH
  }
] as const;

export const SLIDER_FILTERS = [
  {
    icon: iconsMap['chemistry'],
    key: 'soilPh',
    labelKey: 'plant.filters.soilPh',
    min: 4,
    max: 9,
    step: 0.1
  },
  {
    icon: iconsMap['clock'],
    key: 'lightHoursMin',
    labelKey: 'plant.filters.lightHoursMin',
    min: 0,
    max: 16,
    step: 1
  },
  {
    icon: iconsMap['ruler'],
    key: 'spacingCm',
    labelKey: 'plant.filters.spacingCm',
    min: 5,
    max: 200,
    step: 5
  },
  {
    icon: iconsMap['ruler'],
    key: 'soilAvailableDepthCm',
    labelKey: 'plant.filters.soilAvailableDepthCm',
    min: 10,
    max: 200,
    step: 5
  }
] as const;
