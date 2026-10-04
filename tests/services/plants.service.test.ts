import { getPlants } from '../../src/services/plants.service';
import { listPlantsResponse } from '../fixtures/plants/listPlants';

const API_URL = import.meta.env.VITE_API_URL;

function stubFetchOk(body: unknown) {
  const fetchMock = vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      statusText: '',
      json: () => Promise.resolve(body)
    })
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function requestedUrl(fetchMock: ReturnType<typeof stubFetchOk>): string {
  const [url] = fetchMock.mock.lastCall as unknown as [string];
  return decodeURIComponent(url);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getPlants: claves de orden del contrato', () => {
  it('sin sort ordena por name ascendente', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    await getPlants();

    expect(requestedUrl(fetchMock)).toBe(
      `${API_URL}/api/v1/plants?sort[name]=asc`
    );
  });

  it('con sort por scientificName usa esa clave y su dirección', async () => {
    const fetchMock = stubFetchOk(listPlantsResponse);

    await getPlants(undefined, undefined, {
      field: 'scientificName',
      direction: 'desc'
    });

    expect(requestedUrl(fetchMock)).toBe(
      `${API_URL}/api/v1/plants?sort[scientificName]=desc`
    );
  });
});
