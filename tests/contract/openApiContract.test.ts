import { validateRequest } from './openApiContract';

const VALID_LIST_URL =
  '/api/v1/plants?pagination[page]=1&pagination[limit]=25&sort[name]=asc';

function locations(method: 'get', url: string): string[] {
  return validateRequest(method, url).map((violation) => violation.location);
}

describe('validateRequest', () => {
  it('una petición del listado conforme al contrato no tiene violaciones', () => {
    expect(validateRequest('get', VALID_LIST_URL)).toEqual([]);
  });

  it('acepta una URL absoluta con origen y fragmento', () => {
    expect(
      validateRequest('get', 'https://x.test/api/v1/plants?sort[name]=asc#a')
    ).toEqual([]);
  });

  it('acepta una URL codificada', () => {
    expect(validateRequest('get', '/api/v1/plants?sort%5Bname%5D=asc')).toEqual(
      []
    );
  });

  it('una clave repetida se valida como lista', () => {
    expect(
      validateRequest(
        'get',
        '/api/v1/plants?filter[sowingMonths][hasAny]=3&filter[sowingMonths][hasAny]=5'
      )
    ).toEqual([]);
  });

  it('una ruta no declarada es una violación de path', () => {
    expect(locations('get', '/api/v1/plantas')).toEqual(['path']);
  });

  it('un método no declarado es una violación de path', () => {
    expect(validateRequest('delete', '/api/v1/plants')).toEqual([
      expect.objectContaining({ location: 'path' })
    ]);
  });

  it('un parámetro de query no declarado es una violación', () => {
    expect(locations('get', '/api/v1/plants?orderBy=name')).toContain(
      'query.orderBy'
    );
  });

  it('un parámetro deepObject sin corchetes es una violación', () => {
    expect(locations('get', '/api/v1/plants?sort=name')).toContain(
      'query.sort'
    );
  });

  it.each([
    ['sort[identity.name.primary]=asc', 'query.sort'],
    ['pagination[limit]=101', 'query.pagination'],
    ['filter[family][eq]=rosaceae', 'query.filter'],
    ['filter[soilPh][eq]=1e3', 'query.filter']
  ])('%s no cumple el schema (%s)', (query, prefix) => {
    const found = locations('get', `/api/v1/plants?${query}`);

    expect(found.length).toBeGreaterThan(0);
    expect(found.every((location) => location.startsWith(prefix))).toBe(true);
  });
});
