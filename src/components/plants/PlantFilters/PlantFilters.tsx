import { t } from '../../../i18n/core/t';
import { tValue } from '../../../i18n/core/tValue';
import { iconsMap } from '../../../shared/constants/iconsMap';

import SliderFilter from '../SliderFilter';
import ToggleGroup from '../ToggleGroup';

import TextFilter from './components/TextFilter';
import MonthSelector from './components/MonthSelector';
import FamilySelect from './components/FamilySelect/FamilySelect';
import { usePlantFilters } from './hooks/usePlantFilters';

import {
  TOGGLE_FILTERS,
  TEXT_FILTERS,
  SLIDER_FILTERS
} from './config/filters.config';

import './PlantFilters.css';

export default function PlantFilters() {
  const {
    setParam,

    family,
    setFamily,

    textState,
    handleTextChange,

    lifeCycle,
    sowingMethod,
    lightType,
    rootSystem,

    hemisphere,
    sowingMonth,

    soilPh,
    lightHours,
    spacing,
    soilDepth,

    clearFilters,
    setHemisphere
  } = usePlantFilters();

  const toggleValues = {
    lifeCycle,
    sowingMethod,
    lightType,
    rootSystem
  };

  const sliderValues = {
    soilPh,
    lightHoursMin: lightHours,
    spacingCm: spacing,
    soilAvailableDepthCm: soilDepth
  };

  return (
    <div className="plant-filters">
      <button
        data-testid="clear-filters"
        type="button"
        className="plant-filters__clear"
        onClick={clearFilters}
      >
        {iconsMap.clear} {t('plant.filters.clear')}
      </button>

      <FamilySelect value={family} onChange={setFamily} />

      {TEXT_FILTERS.map((filter) => (
        <TextFilter
          testId={`text-filter-${filter.key}`}
          key={filter.key}
          icon={filter.icon}
          label={`${t(filter.labelKey)}`}
          value={textState[filter.key] ?? ''}
          placeholder={t(filter.placeholder)}
          onChange={(value) => handleTextChange(filter.key, value)}
        />
      ))}

      <ToggleGroup
        label={`${iconsMap.planet} ${t('plant.hemisphere.title')}`}
        options={['north', 'south']}
        value={hemisphere}
        onChange={(value) => setHemisphere(value as 'north' | 'south')}
        renderLabel={(value) =>
          value === 'north'
            ? t('plant.hemisphere.north')
            : t('plant.hemisphere.south')
        }
      />

      <MonthSelector
        hemisphere={hemisphere}
        value={sowingMonth}
        onChange={(value) => setParam('sowingMonth', value)}
      />

      {TOGGLE_FILTERS.map((filter) => (
        <ToggleGroup
          key={filter.key}
          label={`${filter.icon} ${t(filter.labelKey)}`}
          options={[...filter.options]}
          value={toggleValues[filter.key]}
          onChange={(value) =>
            setParam(
              filter.key,
              toggleValues[filter.key] === value ? '' : value
            )
          }
          renderLabel={(value) => {
            switch (filter.key) {
              case 'lifeCycle':
                return tValue('plant.filters.lifeCycleValues', value);
              case 'sowingMethod':
                return tValue('plant.filters.sowingMethodValues', value);
              case 'lightType':
                return tValue('plant.filters.lightTypeValues', value);
              case 'rootSystem':
                return tValue('plant.filters.rootSystemValues', value);
              default:
                return value;
            }
          }}
        />
      ))}

      {SLIDER_FILTERS.map((filter) => (
        <SliderFilter
          testId={`slider-filter-${filter.key}`}
          key={filter.key}
          label={`${filter.icon} ${t(filter.labelKey)}`}
          value={sliderValues[filter.key].value}
          min={filter.min}
          max={filter.max}
          step={filter.step}
          onChange={sliderValues[filter.key].setValue}
          onCommit={(value) =>
            setParam(filter.key, value !== null ? String(value) : undefined)
          }
        />
      ))}
    </div>
  );
}
