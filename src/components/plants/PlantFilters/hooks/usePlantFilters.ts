import { useSearchParams } from 'react-router-dom';
import { useDebouncedQueryParam } from './useDebouncedQueryParam';
import { useSliderFilter } from './useSliderFilter';

interface Props {
  onSearchChange: (value: string) => void;
}

export function usePlantFilters({ onSearchChange }: Props) {
  const [params, setParams] = useSearchParams();

  function getParam(key: string) {
    return params.get(key) ?? '';
  }

  function setParam(key: string, value?: string) {
    setParams((prev) => {
      const next = new URLSearchParams(prev);

      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }

      return next;
    });
  }

  function clearParams() {
    setParams({});
  }

  function resetPage() {
    setParam('page', '1');
  }

  const lifeCycle = getParam('lifeCycle');
  const sowingMethod = getParam('sowingMethod');
  const lightType = getParam('lightType');
  const rootSystem = getParam('rootSystem');

  const hemisphere = (getParam('hemisphere') as 'north' | 'south') || 'north';

  const sowingMonth = getParam('sowingMonth');

  const [aliasesValue, setAliasesValue] = useDebouncedQueryParam(
    getParam('aliases'),
    (value) => setParam('aliases', value)
  );

  const [strategicBenefitsValue, setStrategicBenefitsValue] =
    useDebouncedQueryParam(getParam('strategicBenefits'), (value) =>
      setParam('strategicBenefits', value)
    );

  const soilPh = useSliderFilter(getParam('soilPh'));
  const lightHours = useSliderFilter(getParam('lightHoursMin'));
  const spacing = useSliderFilter(getParam('spacingCm'));
  const soilDepth = useSliderFilter(getParam('soilAvailableDepthCm'));

  function clearFilters() {
    clearParams();

    onSearchChange('');

    setAliasesValue('');
    setStrategicBenefitsValue('');

    soilPh.clear();
    lightHours.clear();
    spacing.clear();
    soilDepth.clear();
  }

  function setHemisphere(value: 'north' | 'south') {
    setParam('hemisphere', value);
  }

  return {
    getParam,
    setParam,

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
    setHemisphere,

    resetPage
  };
}
