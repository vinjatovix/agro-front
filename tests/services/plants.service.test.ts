import { getPlantById, getPlants } from '../../src/services/plants.service';
import { ApiError } from '../../src/shared/errors/ApiError';
import { buildPlant } from '../fixtures/plants/buildPlant';
import { listPlantsResponse } from '../fixtures/plants/listPlants';
import { validateRequest } from '../contract/openApiContract';
import {
  PLANT_FILTER_QUERY_KEYS,
  type PlantFilterParams
} from '../../src/services/plantListQuery';
import {
  API_URL,
  JSON_HEADERS,
  lastRequest,
  stubFetchError,
  stubFetchOk
} from '../test-utils/stubFetch';

const NOT_FOUND_BODY = {
  message: 'Plant not found',
  errors: { id: 'not found' }
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getPlants: claves de orden del contrato', () => {
  it('la petición por defecto del listado es exacta y cumple el contrato', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    await getPlants({}, { page: 1, limit: 25 });

    const { url } = lastRequest(fetchMock);
    expect(url).toBe(
      `${API_URL}/api/v1/plants?pagination[page]=1&pagination[limit]=25&sort[name]=asc`
    );
    expect(validateRequest('get', url)).toEqual([]);
  });

  it('sin sort ni paginación ordena por name ascendente', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    await getPlants();

    expect(lastRequest(fetchMock)).toEqual({
      url: `${API_URL}/api/v1/plants?sort[name]=asc`,
      init: { headers: JSON_HEADERS }
    });
  });

  it('con sort por scientificName usa esa clave y su dirección', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    await getPlants(
      {},
      { page: 1, limit: 25 },
      {
        field: 'scientificName',
        direction: 'desc'
      }
    );

    const { url } = lastRequest(fetchMock);
    expect(url).toBe(
      `${API_URL}/api/v1/plants?pagination[page]=1&pagination[limit]=25&sort[scientificName]=desc`
    );
    expect(url.match(/sort\[/g)).toHaveLength(1);
    expect(validateRequest('get', url)).toEqual([]);
  });
});

describe('getPlants: combinaciones de orden', () => {
  it.each([
    ['name', 'asc'],
    ['name', 'desc'],
    ['scientificName', 'asc'],
    ['scientificName', 'desc']
  ] as const)('sort[%s]=%s', async (field, direction) => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    await getPlants({}, { page: 1, limit: 25 }, { field, direction });

    const { url } = lastRequest(fetchMock);
    expect(url).toBe(
      `${API_URL}/api/v1/plants?pagination[page]=1&pagination[limit]=25&sort[${field}]=${direction}`
    );
    expect(url.match(/sort\[/g)).toHaveLength(1);
    expect(validateRequest('get', url)).toEqual([]);
  });
});

describe('getPlants: query completa', () => {
  it('envía filtros, paginación y orden en el orden de construcción', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    await getPlants(
      {
        identity: '  tomate  ',
        family: 'solanaceae',
        lifeCycle: 'annual',
        sowingMethod: 'starter',
        sowingMonths: [3, 4],
        soilPh: '6',
        soilAvailableDepthCm: '30',
        spacingCm: '40',
        lightType: 'full_sun',
        lightHoursMin: '6',
        rootSystem: 'taproot'
      },
      { page: 2, limit: 50 },
      { field: 'name', direction: 'desc' }
    );

    expect(lastRequest(fetchMock).url).toBe(
      `${API_URL}/api/v1/plants?` +
        [
          'filter[identity][contains]=tomate',
          'filter[family][eq]=solanaceae',
          'filter[lifeCycle][eq]=annual',
          'filter[sowingMethod][eq]=starter',
          'filter[sowingMonths][hasAny]=3,4',
          'filter[soilPh][eq]=6',
          'filter[soilAvailableDepthCm][eq]=30',
          'filter[spacingCm][eq]=40',
          'filter[lightType][eq]=full_sun',
          'filter[lightHoursMin][eq]=6',
          'filter[rootSystem][eq]=taproot',
          'pagination[page]=2',
          'pagination[limit]=50',
          'sort[name]=desc'
        ].join('&')
    );
  });

  it('un mes de siembra suelto se envía como hasAny de un valor', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    await getPlants({ sowingMonths: [5] });

    expect(lastRequest(fetchMock).url).toBe(
      `${API_URL}/api/v1/plants?filter[sowingMonths][hasAny]=5&sort[name]=asc`
    );
  });

  it('un identity solo con espacios no se envía', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    await getPlants({ identity: '   ' });

    expect(lastRequest(fetchMock).url).toBe(
      `${API_URL}/api/v1/plants?sort[name]=asc`
    );
  });

  it('devuelve el cuerpo de la respuesta', async () => {
    stubFetchOk(listPlantsResponse);

    await expect(getPlants()).resolves.toEqual(listPlantsResponse);
  });

  it('rechaza con ApiError si la API responde con error', async () => {
    stubFetchError(404, NOT_FOUND_BODY);

    const error = await getPlants().catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, message: 'Plant not found' });
  });
});

const VALID_FILTER_VALUES: Required<PlantFilterParams> = {
  identity: 'tomate',
  family: '3f2504e0-4f89-41d3-9a0c-0305e82c3301',
  lifeCycle: 'annual',
  sowingMethod: 'direct',
  sowingMonths: [3, 5],
  soilPh: '6.5',
  soilAvailableDepthCm: '30',
  spacingCm: '40',
  lightType: 'full_sun',
  lightHoursMin: '6',
  rootSystem: 'taproot',
  edible: 'true',
  toxic: 'false'
};

function formatFilterValue(value: string | number[]): string {
  return Array.isArray(value) ? value.join(',') : value;
}

describe('getPlants: filtros de comestible y tóxica', () => {
  it.each([
    [{ edible: 'true' as const }, 'filter[edible][eq]=true'],
    [{ toxic: 'false' as const }, 'filter[toxic][eq]=false']
  ])('%j envía %s', async (filters, query) => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    await getPlants(filters);

    const { url } = lastRequest(fetchMock);
    expect(url).toBe(`${API_URL}/api/v1/plants?${query}&sort[name]=asc`);
    expect(validateRequest('get', url)).toEqual([]);
  });

  it('se envían tras lifeCycle en el orden de PLANT_FILTER_QUERY_KEYS', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    await getPlants({ toxic: 'false', edible: 'true', lifeCycle: 'annual' });

    expect(lastRequest(fetchMock).url).toBe(
      `${API_URL}/api/v1/plants?` +
        [
          'filter[lifeCycle][eq]=annual',
          'filter[edible][eq]=true',
          'filter[toxic][eq]=false',
          'sort[name]=asc'
        ].join('&')
    );
  });
});

describe('getPlants: cada clave de filtro', () => {
  const fields = Object.keys(PLANT_FILTER_QUERY_KEYS) as Array<
    keyof PlantFilterParams
  >;

  it.each(fields)('%s envía su clave del contrato', async (field) => {
    const fetchMock = stubFetchOk(listPlantsResponse);
    const value = VALID_FILTER_VALUES[field];

    await getPlants({ [field]: value });

    const { url } = lastRequest(fetchMock);
    expect(url).toBe(
      `${API_URL}/api/v1/plants?${PLANT_FILTER_QUERY_KEYS[field]}=${formatFilterValue(value)}&sort[name]=asc`
    );
    expect(validateRequest('get', url)).toEqual([]);
  });
});

describe('getPlantById', () => {
  it('pide la planta por id con las cabeceras por defecto', async () => {
    const plant = buildPlant({ id: 'abc' });
    const fetchMock = stubFetchOk(plant);

    const result = await getPlantById('abc');

    expect(result).toEqual(plant);
    expect(lastRequest(fetchMock)).toEqual({
      url: `${API_URL}/api/v1/plants/abc`,
      init: { headers: JSON_HEADERS }
    });
  });

  it('rechaza con ApiError si la planta no existe', async () => {
    stubFetchError(404, NOT_FOUND_BODY);

    const error = await getPlantById('abc').catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, message: 'Plant not found' });
  });
});
