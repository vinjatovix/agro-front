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

interface Props {
  readonly search: string;
  readonly onSearchChange: (value: string) => void;
}

export default function PlantFilters({ search, onSearchChange }: Props) {
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
  } = usePlantFilters({ onSearchChange });

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
        type="button"
        className="plant-filters__clear"
        onClick={clearFilters}
      >
        Clear filters
      </button>

      <TextFilter
        value={search}
        onChange={onSearchChange}
        label="Search plants"
        placeholder="Search plants"
      />

      <FamilySelect value={family} onChange={setFamily} />

      {TEXT_FILTERS.map((filter) => (
        <TextFilter
          key={filter.key}
          label={filter.label}
          value={textState[filter.key] ?? ''}
          onChange={(value) => handleTextChange(filter.key, value)}
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
