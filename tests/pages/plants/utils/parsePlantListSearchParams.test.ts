import { parsePlantListSearchParams } from '../../../../src/pages/plants/utils/parsePlantListSearchParams';

function parse(query: string) {
  return parsePlantListSearchParams(new URLSearchParams(query));
}

describe('parsePlantListSearchParams: orden', () => {
  it('sin parámetros devuelve la petición por defecto', () => {
    expect(parse('')).toEqual({
      filters: {},
      pagination: { page: 1, limit: 25 },
      sort: { field: 'name', direction: 'asc' }
    });
  });

  it.each([
    ['sortField=scientificName&sortDirection=desc', 'scientificName', 'desc'],
    ['sortField=identity.name.primary', 'name', 'asc'],
    ['sortField=foo&sortField=scientificName', 'scientificName', 'asc'],
    ['sortDirection=%20desc%20', 'name', 'desc'],
    ['sortDirection=up', 'name', 'asc'],
    ['sortField=scientificName', 'scientificName', 'asc'],
    ['sortDirection=desc', 'name', 'desc']
  ])('%s → %s %s', (query, field, direction) => {
    expect(parse(query).sort).toEqual({ field, direction });
  });
});
