import {
  DEFAULT_PLANT_SORT,
  FAMILY_PLANTS_FIELDS,
  PAGINATION_LIMIT_MAX,
  PAGINATION_QUERY_KEYS,
  PLANT_FIELDS,
  PLANT_FIELDS_QUERY_KEY,
  PLANT_FILTER_QUERY_KEYS,
  PLANT_LIST_FIELDS,
  PLANT_SORT_FIELDS,
  SORT_DIRECTIONS,
  isPlantsSortField,
  isSortDirection,
  sortQueryKey
} from '../../src/services/plantListQuery';
import { SUPPORTED_LIMITS } from '../../src/shared/components/constants';

describe('plantListQuery', () => {
  it('declara las claves de orden del contrato', () => {
    expect(PLANT_SORT_FIELDS).toEqual(['name', 'scientificName']);
    expect(SORT_DIRECTIONS).toEqual(['asc', 'desc']);
    expect(DEFAULT_PLANT_SORT).toEqual({ field: 'name', direction: 'asc' });
  });

  it('construye la clave de orden', () => {
    expect(sortQueryKey('scientificName')).toBe('sort[scientificName]');
  });

  it('declara las claves de paginación y su máximo', () => {
    expect(PAGINATION_QUERY_KEYS).toEqual({
      page: 'pagination[page]',
      limit: 'pagination[limit]'
    });
    expect(PAGINATION_LIMIT_MAX).toBe(100);
  });

  it('cada clave de filtro tiene la forma filter[campo][operador]', () => {
    Object.values(PLANT_FILTER_QUERY_KEYS).forEach((key) => {
      expect(key).toMatch(/^filter\[[a-zA-Z]+\]\[[a-zA-Z]+\]$/);
    });
  });

  it.each(SUPPORTED_LIMITS)(
    'el límite %i del selector no supera el máximo del contrato',
    (limit) => {
      expect(limit).toBeGreaterThanOrEqual(1);
      expect(limit).toBeLessThanOrEqual(PAGINATION_LIMIT_MAX);
    }
  );

  it('reconoce solo claves y sentidos de orden declarados', () => {
    expect(isPlantsSortField('scientificName')).toBe(true);
    expect(isPlantsSortField('identity.name.primary')).toBe(false);
    expect(isSortDirection('desc')).toBe(true);
    expect(isSortDirection('up')).toBe(false);
  });

  it('declara la clave y los campos de primer nivel de fields[plants]', () => {
    expect(PLANT_FIELDS_QUERY_KEY).toBe('fields[plants]');
    expect([...PLANT_FIELDS].sort()).toEqual(
      [
        'id',
        'identity',
        'traits',
        'phenology',
        'knowledge',
        'image',
        'metadata',
        'status',
        'deletedAt',
        'version'
      ].sort()
    );
  });

  it('declara la selección de cada listado en orden y sin id', () => {
    expect(PLANT_LIST_FIELDS).toEqual([
      'identity',
      'traits',
      'image',
      'status'
    ]);
    expect(FAMILY_PLANTS_FIELDS).toEqual(['identity', 'status']);
    expect(PLANT_LIST_FIELDS).not.toContain('id');
    expect(FAMILY_PLANTS_FIELDS).not.toContain('id');
  });
});
