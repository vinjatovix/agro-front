import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useFamilyPlants } from '../../../../src/pages/families/hooks/useFamilyPlants';
import { getPlants } from '../../../../src/services/plants.service';

import type { PaginatedResponse } from '../../../../src/types/api';
import type { Plant } from '../../../../src/types/Plants/Plant';

import { listPlantsResponse } from '../../../fixtures/plants/listPlants';
import { createTestQueryClient } from '../../../test-utils/createTestQueryClient';

vi.mock('../../../../src/services/plants.service', () => ({
  getPlants: vi.fn()
}));

const mockedGetPlants = vi.mocked(getPlants);

function createWrapper() {
  const queryClient = createTestQueryClient();

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useFamilyPlants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads family plants successfully', async () => {
    mockedGetPlants.mockResolvedValue(listPlantsResponse);

    const { result } = renderHook(
      () => useFamilyPlants('5a2380c4-1546-4511-a77b-ec9d3ebcb7cf'),
      {
        wrapper: createWrapper()
      }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(listPlantsResponse.data);
    });

    expect(mockedGetPlants).toHaveBeenCalledWith({
      family: '5a2380c4-1546-4511-a77b-ec9d3ebcb7cf'
    });
  });

  it('returns empty array when API returns no data', async () => {
    mockedGetPlants.mockResolvedValue({
      data: [],
      pagination: {
        page: 1,
        limit: 25,
        totalPages: 0,
        totalItems: 0
      }
    });

    const { result } = renderHook(
      () => useFamilyPlants('5a2380c4-1546-4511-a77b-ec9d3ebcb7cf'),
      {
        wrapper: createWrapper()
      }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
    });
  });

  it('handles error state', async () => {
    mockedGetPlants.mockRejectedValue(new Error('API error'));

    const { result } = renderHook(
      () => useFamilyPlants('5a2380c4-1546-4511-a77b-ec9d3ebcb7cf'),
      {
        wrapper: createWrapper()
      }
    );

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });

  it('exposes loading state', () => {
    mockedGetPlants.mockImplementation(
      () => new Promise(() => {}) as Promise<PaginatedResponse<Plant>>
    );

    const { result } = renderHook(
      () => useFamilyPlants('5a2380c4-1546-4511-a77b-ec9d3ebcb7cf'),
      {
        wrapper: createWrapper()
      }
    );

    expect(result.current.loading).toBe(true);
  });
});
