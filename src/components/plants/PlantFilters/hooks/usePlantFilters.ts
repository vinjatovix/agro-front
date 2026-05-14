import { useSearchParams } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { useSliderFilter } from './useSliderFilter';
import { useDebouncedCallback } from './useDebouncedCallback';

interface Props {
  readonly onSearchChange: (value: string) => void;
}

function useTextFilters(
  setParam: (key: string, value?: string) => void,
  getParam: (key: string) => string
) {
  const aliases = getParam('aliases');
  const strategicBenefits = getParam('strategicBenefits');

  const [textState, setTextState] = useState<Record<string, string>>({
    aliases,
    strategicBenefits
  });

  const setTextValue = useCallback((key: string, value: string) => {
    setTextState((prev) => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const aliasesDebounce = useDebouncedCallback((value: string) => {
    setParam('aliases', value);
  }, 300);

  const strategicDebounce = useDebouncedCallback((value: string) => {
    setParam('strategicBenefits', value);
  }, 300);

  const handleTextChange = useCallback(
    (key: string, value: string) => {
      setTextValue(key, value);

      if (key === 'aliases') {
        aliasesDebounce.call(value);
      } else {
        strategicDebounce.call(value);
      }
    },
    [setTextValue, aliasesDebounce, strategicDebounce]
  );

  const clearText = useCallback(() => {
    setTextState({
      aliases: '',
      strategicBenefits: ''
    });

    aliasesDebounce.cancel();
    strategicDebounce.cancel();
  }, [aliasesDebounce, strategicDebounce]);

  return { textState, handleTextChange, clearText };
}

function useSliderFilters(getParam: (key: string) => string) {
  const soilPh = useSliderFilter(getParam('soilPh'));
  const lightHours = useSliderFilter(getParam('lightHoursMin'));
  const spacing = useSliderFilter(getParam('spacingCm'));
  const soilDepth = useSliderFilter(getParam('soilAvailableDepthCm'));

  return { soilPh, lightHours, spacing, soilDepth };
}

function useSelectFilters(getParam: (key: string) => string) {
  const lifeCycle = getParam('lifeCycle');
  const sowingMethod = getParam('sowingMethod');
  const lightType = getParam('lightType');
  const rootSystem = getParam('rootSystem');
  const sowingMonth = getParam('sowingMonth');
  const hemisphere = (getParam('hemisphere') as 'north' | 'south') || 'north';

  return {
    lifeCycle,
    sowingMethod,
    lightType,
    rootSystem,
    sowingMonth,
    hemisphere
  };
}

export function usePlantFilters({ onSearchChange }: Props) {
  const [params, setParams] = useSearchParams();

  const setParam = useCallback(
    (key: string, value?: string) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);

        if (value && value.length > 0) next.set(key, value);
        else next.delete(key);

        return next;
      });
    },
    [setParams]
  );

  const getParam = useCallback(
    (key: string) => params.get(key) ?? '',
    [params]
  );

  const family = getParam('family');

  const setFamily = useCallback(
    (value: string) => {
      setParam('family', value);
    },
    [setParam]
  );

  const { textState, handleTextChange, clearText } = useTextFilters(
    setParam,
    getParam
  );
  const { soilPh, lightHours, spacing, soilDepth } = useSliderFilters(getParam);
  const {
    lifeCycle,
    sowingMethod,
    lightType,
    rootSystem,
    sowingMonth,
    hemisphere
  } = useSelectFilters(getParam);

  const clearFilters = useCallback(() => {
    setParams({});
    onSearchChange('');
    clearText();
    soilPh.clear();
    lightHours.clear();
    spacing.clear();
    soilDepth.clear();
  }, [
    setParams,
    onSearchChange,
    clearText,
    soilPh,
    lightHours,
    spacing,
    soilDepth
  ]);

  const setHemisphere = useCallback(
    (value: 'north' | 'south') => {
      setParam('hemisphere', value);
    },
    [setParam]
  );

  return {
    setParam,
    getParam,

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
  };
}
