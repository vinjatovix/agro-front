import { useSearchParams } from 'react-router-dom';
import { useCallback, useState, useMemo } from 'react';
import { useSliderFilter } from './useSliderFilter';
import { useDebouncedCallback } from './useDebouncedCallback';

type TextFilterKey = 'identity' | 'strategicBenefits';

function useTextFilters(
  setParam: (key: string, value?: string) => void,
  getParam: (key: string) => string
) {
  const [textState, setTextState] = useState<Record<TextFilterKey, string>>({
    identity: getParam('identity'),
    strategicBenefits: getParam('strategicBenefits')
  });

  const setTextValue = useCallback((key: TextFilterKey, value: string) => {
    setTextState((prev) => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const debouncedIdentity = useDebouncedCallback((value: string) => {
    setParam('identity', value);
  }, 300);

  const debouncedAliases = useDebouncedCallback((value: string) => {
    setParam('aliases', value);
  }, 300);

  const debouncedStrategicBenefits = useDebouncedCallback((value: string) => {
    setParam('strategicBenefits', value);
  }, 300);

  const debounceMap = useMemo(
    () => ({
      identity: debouncedIdentity,
      aliases: debouncedAliases,
      strategicBenefits: debouncedStrategicBenefits
    }),
    [debouncedIdentity, debouncedAliases, debouncedStrategicBenefits]
  );

  const handleTextChange = useCallback(
    (key: TextFilterKey, value: string) => {
      setTextValue(key, value);
      debounceMap[key].call(value);
    },
    [setTextValue, debounceMap]
  );

  const clearText = useCallback(() => {
    setTextState({
      identity: '',
      strategicBenefits: ''
    });

    Object.values(debounceMap).forEach((debounce) => debounce.cancel());
  }, [debounceMap]);

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

export function usePlantFilters() {
  const [params, setParams] = useSearchParams();

  const setParam = useCallback(
    (key: string, value?: string) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);

        if (value && value.length > 0) next.set(key, value);
        else next.delete(key);

        if (key !== 'page') {
          next.delete('page');
        }

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
    clearText();
    soilPh.clear();
    lightHours.clear();
    spacing.clear();
    soilDepth.clear();
  }, [setParams, clearText, soilPh, lightHours, spacing, soilDepth]);

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
