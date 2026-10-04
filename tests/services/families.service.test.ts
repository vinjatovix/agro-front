import {
  getFamilies,
  getFamilyById
} from '../../src/services/families.service';
import { ApiError } from '../../src/shared/errors/ApiError';
import { buildFamily } from '../fixtures/families/buildFamily';
import { listFamiliesResponse } from '../fixtures/families/listFamilies';
import {
  API_URL,
  JSON_HEADERS,
  lastRequest,
  stubFetchError,
  stubFetchOk
} from '../test-utils/stubFetch';

const NOT_FOUND_BODY = {
  message: 'Family not found',
  errors: { idOrSlug: 'not found' }
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getFamilies', () => {
  it('pide hasta 100 familias ordenadas por name', async () => {
    const fetchMock = stubFetchOk(listFamiliesResponse);

    const result = await getFamilies();

    expect(result).toEqual(listFamiliesResponse);
    expect(lastRequest(fetchMock)).toEqual({
      url: `${API_URL}/api/v1/families?pagination[limit]=100&sort[name]=asc`,
      init: { headers: JSON_HEADERS }
    });
  });

  it('rechaza con ApiError si la API responde con error', async () => {
    stubFetchError(404, NOT_FOUND_BODY);

    const error = await getFamilies().catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, message: 'Family not found' });
  });
});

describe('getFamilyById', () => {
  it('pide la familia por id o slug', async () => {
    const family = buildFamily({ slug: 'solanaceae' });
    const fetchMock = stubFetchOk(family);

    const result = await getFamilyById('solanaceae');

    expect(result).toEqual(family);
    expect(lastRequest(fetchMock)).toEqual({
      url: `${API_URL}/api/v1/families/solanaceae`,
      init: { headers: JSON_HEADERS }
    });
  });

  it('rechaza con ApiError si la familia no existe', async () => {
    stubFetchError(404, NOT_FOUND_BODY);

    const error = await getFamilyById('solanaceae').catch(
      (caught: unknown) => caught
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, message: 'Family not found' });
  });
});
