import { getPlantById, getPlants } from '../../src/services/plants.service';
import { ApiError } from '../../src/shared/errors/ApiError';
import { buildPlant } from '../fixtures/plants/buildPlant';
import { listPlantsResponse } from '../fixtures/plants/listPlants';
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
  it('sin sort ordena por name ascendente', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    await getPlants();

    expect(lastRequest(fetchMock)).toEqual({
      url: `${API_URL}/api/v1/plants?sort[name]=asc`,
      init: { headers: JSON_HEADERS }
    });
  });

  it('con sort por scientificName usa esa clave y su dirección', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    await getPlants(undefined, undefined, {
      field: 'scientificName',
      direction: 'desc'
    });

    expect(lastRequest(fetchMock).url).toBe(
      `${API_URL}/api/v1/plants?sort[scientificName]=desc`
    );
  });

  it('una clave de orden no permitida cae a name', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    await getPlants(undefined, undefined, {
      field: 'identity.name.primary',
      direction: 'asc'
    });

    expect(lastRequest(fetchMock).url).toBe(
      `${API_URL}/api/v1/plants?sort[name]=asc`
    );
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
        soilPh: 6,
        soilAvailableDepthCm: 30,
        spacingCm: 40,
        lightType: 'full_sun',
        lightHoursMin: 6,
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

    await getPlants({ sowingMonths: 5 });

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
