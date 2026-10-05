import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import { usePlants } from '../../../../src/pages/plants/hooks/usePlants';
import { parsePlantListSearchParams } from '../../../../src/pages/plants/utils/parsePlantListSearchParams';
import { getPlants } from '../../../../src/services/plants.service';
import type { PaginatedResponse } from '../../../../src/types/api';
import type { Plant } from '../../../../src/types/Plants/Plant';

import { listPlantsResponse } from '../../../fixtures/plants/listPlants';
import { createTestQueryClient } from '../../../test-utils/createTestQueryClient';

vi.mock('../../../../src/services/plants.service', () => ({
  getPlants: vi.fn()
}));

const mockedGetPlants = vi.mocked(getPlants);

function usePlantsWithLocation() {
  return { plants: usePlants(), search: useLocation().search };
}

function renderUsePlants(route = '/plants') {
  const queryClient = createTestQueryClient();
  return renderHook(() => usePlantsWithLocation(), {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="*" element={children} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )
  });
}

function searchParams(search: string) {
  return new URLSearchParams(search);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockedGetPlants.mockResolvedValue(listPlantsResponse);
});

describe('usePlants: query', () => {
  it('expone la carga mientras no llega la respuesta', () => {
    mockedGetPlants.mockImplementation(
      () => new Promise<PaginatedResponse<Plant>>(() => {})
    );

    const { result } = renderUsePlants();

    expect(result.current.plants.query.isLoading).toBe(true);
  });

  it('expone los datos al llegar la respuesta', async () => {
    const { result } = renderUsePlants();

    await waitFor(() => {
      expect(result.current.plants.query.data).toEqual(listPlantsResponse);
    });
  });

  it('expone el error de la API', async () => {
    mockedGetPlants.mockRejectedValue(new Error('API error'));

    const { result } = renderUsePlants();

    await waitFor(() => {
      expect(result.current.plants.query.error).toBeInstanceOf(Error);
    });
  });
});

describe('usePlants: petición', () => {
  const route =
    '/plants?page=2&limit=50&sortField=scientificName&sortDirection=desc&lifeCycle=annual';

  it('la petición es la de parsePlantListSearchParams sobre la URL', () => {
    const { result } = renderUsePlants(route);

    expect(result.current.plants.request).toEqual(
      parsePlantListSearchParams(searchParams(route.split('?')[1]))
    );
  });

  it('llama a getPlants con filtros, paginación y orden de la petición', async () => {
    const { result } = renderUsePlants(route);
    const { filters, pagination, sort } = result.current.plants.request;

    await waitFor(() => {
      expect(mockedGetPlants).toHaveBeenCalledWith(filters, pagination, sort);
    });
  });
});

describe('usePlants: setters', () => {
  const route =
    '/plants?page=3&limit=25&sortField=name&sortDirection=asc&lifeCycle=annual';

  it.each([
    ['setSortField', 'sortField', 'scientificName'],
    ['setSortDirection', 'sortDirection', 'desc'],
    ['setLimit', 'limit', '50']
  ] as const)(
    '%s escribe su parámetro, borra page y conserva el resto',
    async (setter, param, expected) => {
      const { result } = renderUsePlants(route);

      act(() => {
        const { plants } = result.current;
        if (setter === 'setSortField') plants.setSortField('scientificName');
        if (setter === 'setSortDirection') plants.setSortDirection('desc');
        if (setter === 'setLimit') plants.setLimit(50);
      });

      await waitFor(() => {
        const params = searchParams(result.current.search);
        expect(params.get(param)).toBe(expected);
        expect(params.has('page')).toBe(false);
        expect(params.get('lifeCycle')).toBe('annual');
      });
      expect(result.current.plants.request.pagination.page).toBe(1);
    }
  );

  it('setPage escribe page y conserva orden, límite y filtros', async () => {
    const { result } = renderUsePlants(route);

    act(() => {
      result.current.plants.setPage(4);
    });

    await waitFor(() => {
      expect(result.current.plants.request.pagination.page).toBe(4);
    });
    const params = searchParams(result.current.search);
    expect(params.get('sortField')).toBe('name');
    expect(params.get('sortDirection')).toBe('asc');
    expect(params.get('limit')).toBe('25');
    expect(params.get('lifeCycle')).toBe('annual');
  });
});
