import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { usePlants } from '../../../../src/pages/plants/hooks/usePlants';
import { getPlants } from '../../../../src/services/plants.service';
import type { PaginatedResponse } from '../../../../src/types/api';
import type { Plant } from '../../../../src/types/Plants/Plant';

import { listPlantsResponse } from '../../../fixtures/plants/listPlants';
import { createTestQueryClient } from '../../../test-utils/createTestQueryClient';

vi.mock('../../../../src/services/plants.service', () => ({
  getPlants: vi.fn()
}));

const mockedGetPlants = vi.mocked(getPlants);

function createWrapper(initialEntries: string[] = ['/plants']) {
  const queryClient = createTestQueryClient();

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="*" element={children} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };
}

describe('usePlants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads plants successfully', async () => {
    mockedGetPlants.mockResolvedValue(listPlantsResponse);

    const { result } = renderHook(() => usePlants(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.data.length).toBeGreaterThan(0);
    });

    expect(mockedGetPlants).toHaveBeenCalled();
  });

  it('calls API with filters from URL', async () => {
    mockedGetPlants.mockResolvedValue(listPlantsResponse);

    renderHook(() => usePlants(), {
      wrapper: createWrapper(['/plants?family=rosaceae&identity=pepper'])
    });

    await waitFor(() => {
      expect(mockedGetPlants).toHaveBeenCalledWith(
        expect.objectContaining({
          family: 'rosaceae',
          identity: 'pepper'
        }),
        expect.any(Object),
        expect.any(Object)
      );
    });
  });

  it('passes pagination and sort', async () => {
    mockedGetPlants.mockResolvedValue(listPlantsResponse);

    renderHook(() => usePlants(), {
      wrapper: createWrapper(['/plants?page=2&limit=25&sortDirection=desc'])
    });

    await waitFor(() => {
      expect(mockedGetPlants).toHaveBeenCalledWith(
        expect.any(Object),
        {
          page: 2,
          limit: 25
        },
        {
          field: 'identity.name.primary',
          direction: 'desc'
        }
      );
    });
  });

  it('handles error state', async () => {
    mockedGetPlants.mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => usePlants(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });

  it('exposes loading state', () => {
    mockedGetPlants.mockImplementation(
      () => new Promise(() => {}) as Promise<PaginatedResponse<Plant>>
    );

    const { result } = renderHook(() => usePlants(), {
      wrapper: createWrapper()
    });

    expect(result.current.loading).toBe(true);
  });

  it('updates page search param when setPage is called', async () => {
    mockedGetPlants.mockResolvedValue(listPlantsResponse);

    const { result } = renderHook(() => usePlants(), {
      wrapper: createWrapper(['/plants?page=1'])
    });

    await waitFor(() => {
      expect(mockedGetPlants).toHaveBeenCalled();
    });

    act(() => {
      result.current.setPage(3);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(3);
    });
  });

  it('updates limit and resets page when setLimit is called', async () => {
    mockedGetPlants.mockResolvedValue(listPlantsResponse);

    const { result } = renderHook(() => usePlants(), {
      wrapper: createWrapper(['/plants?page=4&limit=25'])
    });

    await waitFor(() => {
      expect(mockedGetPlants).toHaveBeenCalled();
    });

    act(() => {
      result.current.setLimit(50);
    });

    await waitFor(() => {
      expect(result.current.limit).toBe(50);
      expect(result.current.page).toBe(1);
    });
  });

  it('updates sort direction and resets page when setSortDirection is called', async () => {
    mockedGetPlants.mockResolvedValue(listPlantsResponse);

    const { result } = renderHook(() => usePlants(), {
      wrapper: createWrapper(['/plants?page=4&sortDirection=asc'])
    });

    await waitFor(() => {
      expect(mockedGetPlants).toHaveBeenCalled();
    });

    act(() => {
      result.current.setSortDirection('desc');
    });

    await waitFor(() => {
      expect(result.current.sortDirection).toBe('desc');
      expect(result.current.page).toBe(1);
    });
  });
});
