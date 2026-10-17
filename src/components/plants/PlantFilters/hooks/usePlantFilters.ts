import { useSearchParams } from 'react-router-dom';
import { useCallback, useState, useMemo } from 'react';
import { useSliderFilter } from './useSliderFilter';
import { useDebouncedCallback } from './useDebouncedCallback';
import { PLANT_LIST_URL_PARAMS } from '../../../../shared/constants/plantListUrlParams';
import { parseBooleanFilter } from '../../../../services/plantListQuery';

type TextFilterKey = 'identity';

function useTextFilters(
  setParam: (key: string, value?: string) => void,
  getParam: (key: string) => string
) {
  const urlIdentity = getParam(PLANT_LIST_URL_PARAMS.identity);
  const [textState, setTextState] = useState<Record<TextFilterKey, string>>({
    identity: urlIdentity
  });
  const [lastUrlIdentity, setLastUrlIdentity] = useState(urlIdentity);

  if (urlIdentity !== lastUrlIdentity) {
    setLastUrlIdentity(urlIdentity);
    setTextState((prev) => ({ ...prev, identity: urlIdentity }));
  }

  const setTextValue = useCallback((key: TextFilterKey, value: string) => {
    setTextState((prev) => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const debouncedIdentity = useDebouncedCallback((value: string) => {
    setParam(PLANT_LIST_URL_PARAMS.identity, value);
  }, 300);

  const debounceMap = useMemo(
    () => ({
      identity: debouncedIdentity
    }),
    [debouncedIdentity]
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
      identity: ''
    });

    Object.values(debounceMap).forEach((debounce) => debounce.cancel());
  }, [debounceMap]);

  return { textState, handleTextChange, clearText };
}

function useSliderFilters(getParam: (key: string) => string) {
  const soilPh = useSliderFilter(getParam(PLANT_LIST_URL_PARAMS.soilPh));
  const lightHours = useSliderFilter(
    getParam(PLANT_LIST_URL_PARAMS.lightHoursMin)
  );
  const spacing = useSliderFilter(getParam(PLANT_LIST_URL_PARAMS.spacingCm));
  const soilDepth = useSliderFilter(
    getParam(PLANT_LIST_URL_PARAMS.soilAvailableDepthCm)
  );

  return { soilPh, lightHours, spacing, soilDepth };
}

function useSelectFilters(getParam: (key: string) => string) {
  const lifeCycle = getParam(PLANT_LIST_URL_PARAMS.lifeCycle);
  const sowingMethod = getParam(PLANT_LIST_URL_PARAMS.sowingMethod);
  const lightType = getParam(PLANT_LIST_URL_PARAMS.lightType);
  const rootSystem = getParam(PLANT_LIST_URL_PARAMS.rootSystem);
  const sowingMonth = getParam(PLANT_LIST_URL_PARAMS.sowingMonth);
  const hemisphere =
    (getParam(PLANT_LIST_URL_PARAMS.hemisphere) as 'north' | 'south') ||
    'north';

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

        if (key !== PLANT_LIST_URL_PARAMS.page) {
          next.delete(PLANT_LIST_URL_PARAMS.page);
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

  const family = getParam(PLANT_LIST_URL_PARAMS.family);
  const edible = parseBooleanFilter(
    params.getAll(PLANT_LIST_URL_PARAMS.edible)
  );
  const toxic = parseBooleanFilter(params.getAll(PLANT_LIST_URL_PARAMS.toxic));

  const setFamily = useCallback(
    (value: string) => {
      setParam(PLANT_LIST_URL_PARAMS.family, value);
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
      setParam(PLANT_LIST_URL_PARAMS.hemisphere, value);
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
    edible,
    toxic,

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
