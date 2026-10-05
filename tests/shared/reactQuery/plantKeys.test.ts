import { plantKeys } from '../../../src/shared/reactQuery/plantKeys';
import type { PlantListRequest } from '../../../src/services/plantListQuery';

function buildRequest(): PlantListRequest {
  return {
    filters: { lifeCycle: 'annual' },
    pagination: { page: 1, limit: 25 },
    sort: { field: 'name', direction: 'asc' }
  };
}

describe('plantKeys', () => {
  it('agrupa todas las keys de plantas', () => {
    expect(plantKeys.all).toEqual(['plants']);
  });

  it('la key del listado incluye la petición', () => {
    const request = buildRequest();

    expect(plantKeys.list(request)).toEqual(['plants', 'list', request]);
  });

  it('dos peticiones con el mismo contenido producen la misma key', () => {
    expect(plantKeys.list(buildRequest())).toEqual(
      plantKeys.list(buildRequest())
    );
  });

  it('la key del detalle incluye el identificador de la planta', () => {
    const plantId = 'plant-123';

    const key = plantKeys.detail(plantId);

    expect(key).toEqual(['plants', 'detail', plantId]);
  });
});
