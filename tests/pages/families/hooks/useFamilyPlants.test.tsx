import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useFamilyPlants } from '../../../../src/pages/families/hooks/useFamilyPlants';
import { getFamilyPlants } from '../../../../src/services/plants.service';

import type { PaginatedResponse } from '../../../../src/types/api';
import type { FamilyPlantItem } from '../../../../src/types/Plants/Plant';

import { listPlantsResponse } from '../../../fixtures/plants/listPlants';
import { createTestQueryClient } from '../../../test-utils/createTestQueryClient';

vi.mock('../../../../src/services/plants.service', () => ({
  getFamilyPlants: vi.fn()
}));

const mockedGetFamilyPlants = vi.mocked(getFamilyPlants);

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
    mockedGetFamilyPlants.mockResolvedValue(listPlantsResponse);

    const { result } = renderHook(
      () => useFamilyPlants('5a2380c4-1546-4511-a77b-ec9d3ebcb7cf'),
      {
        wrapper: createWrapper()
      }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(listPlantsResponse.data);
    });

    expect(mockedGetFamilyPlants).toHaveBeenCalledExactlyOnceWith(
      '5a2380c4-1546-4511-a77b-ec9d3ebcb7cf'
    );
  });

  it('returns empty array when API returns no data', async () => {
    mockedGetFamilyPlants.mockResolvedValue({
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
    mockedGetFamilyPlants.mockRejectedValue(new Error('API error'));

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
    mockedGetFamilyPlants.mockImplementation(
      () => new Promise(() => {}) as Promise<PaginatedResponse<FamilyPlantItem>>
    );

    const { result } = renderHook(
      () => useFamilyPlants('5a2380c4-1546-4511-a77b-ec9d3ebcb7cf'),
      {
        wrapper: createWrapper()
      }
    );

    expect(result.current.loading).toBe(true);
  });

  it('does not call getFamilyPlants when familyId is undefined', () => {
    renderHook(() => useFamilyPlants(undefined), {
      wrapper: createWrapper()
    });

    expect(mockedGetFamilyPlants).not.toHaveBeenCalled();
  });

  it('returns empty data when familyId is undefined', () => {
    const { result } = renderHook(() => useFamilyPlants(undefined), {
      wrapper: createWrapper()
    });

    expect(result.current.data).toEqual([]);
  });

  it('returns loading as false when familyId is undefined', () => {
    const { result } = renderHook(() => useFamilyPlants(undefined), {
      wrapper: createWrapper()
    });

    expect(result.current.loading).toBe(false);
  });

  it('returns total items count from pagination', async () => {
    mockedGetFamilyPlants.mockResolvedValue({
      data: listPlantsResponse.data,
      pagination: {
        page: 1,
        limit: 25,
        totalPages: 2,
        totalItems: 42
      }
    });

    const { result } = renderHook(
      () => useFamilyPlants('5a2380c4-1546-4511-a77b-ec9d3ebcb7cf'),
      {
        wrapper: createWrapper()
      }
    );

    await waitFor(() => {
      expect(result.current.total).toBe(42);
    });
  });

  it('returns total as 0 when familyId is undefined', () => {
    const { result } = renderHook(() => useFamilyPlants(undefined), {
      wrapper: createWrapper()
    });

    expect(result.current.total).toBe(0);
  });
});
