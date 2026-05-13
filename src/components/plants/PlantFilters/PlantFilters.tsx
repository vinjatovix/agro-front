import SliderFilter from '../SliderFilter';
import ToggleGroup from '../ToggleGroup';

import TextFilter from './components/TextFilter';
import MonthSelector from './components/MonthSelector';

import { usePlantFilters } from './hooks/usePlantFilters';

import {
  TOGGLE_FILTERS,
  TEXT_FILTERS,
  SLIDER_FILTERS
} from './config/filters.config';

import './PlantFilters.css';
import FamilySelect from './components/FamilySelect/FamilySelect';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function PlantFilters({ search, onSearchChange }: Props) {
  const {
    setParam,
    getParam,

    lifeCycle,
    sowingMethod,
    lightType,
    rootSystem,

    hemisphere,
    sowingMonth,

    aliasesValue,
    setAliasesValue,

    strategicBenefitsValue,
    setStrategicBenefitsValue,

    soilPh,
    lightHours,
    spacing,
    soilDepth,

    clearFilters,
    setHemisphere
  } = usePlantFilters({
    onSearchChange
  });

  const toggleValues = {
    lifeCycle,
    sowingMethod,
    lightType,
    rootSystem
  };

  const textValues = {
    aliases: {
      value: aliasesValue,
      setValue: setAliasesValue
    },

    strategicBenefits: {
      value: strategicBenefitsValue,
      setValue: setStrategicBenefitsValue
    }
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
        type="button"
        className="plant-filters__clear"
        onClick={clearFilters}
      >
        Clear filters
      </button>

      <div className="plant-filters__group">
        <input
          className="plant-filters__input"
          type="text"
          placeholder="Search plants..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <FamilySelect
        value={getParam('family')}
        onChange={(id) => setParam('family', id)}
      />

      {TEXT_FILTERS.map((filter) => (
        <TextFilter
          key={filter.key}
          label={filter.label}
          value={textValues[filter.key].value}
          onChange={textValues[filter.key].setValue}
        />
      ))}

      <ToggleGroup
        label="Hemisphere"
        options={['north', 'south']}
        value={hemisphere}
        onChange={(value) => setHemisphere(value as 'north' | 'south')}
        renderLabel={(value) => (value === 'north' ? 'North' : 'South')}
      />

      <MonthSelector
        hemisphere={hemisphere}
        value={sowingMonth}
        onChange={(value) => setParam('sowingMonth', value)}
      />

      {TOGGLE_FILTERS.map((filter) => (
        <ToggleGroup
          key={filter.key}
          label={filter.label}
          options={[...filter.options]}
          value={toggleValues[filter.key]}
          onChange={(value) =>
            setParam(
              filter.key,
              toggleValues[filter.key] === value ? '' : value
            )
          }
        />
      ))}

      {SLIDER_FILTERS.map((filter) => (
        <SliderFilter
          key={filter.key}
          label={filter.label}
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
