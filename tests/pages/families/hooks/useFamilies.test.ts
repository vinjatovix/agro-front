import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import { useFamilies } from '../../../../src/pages/families/hooks/useFamilies';
import { getFamilies } from '../../../../src/services/families.service';

import type { Family } from '../../../../src/types/Family';
import { listFamiliesResponse } from '../../../fixtures/families/listFamilies';
import { PaginatedResponse } from '../../../../src/types/api';

vi.mock('../../../../src/services/families.service', () => ({
  getFamilies: vi.fn()
}));

const mockedGetFamilies = vi.mocked(getFamilies);

const familiesMock: Family[] = listFamiliesResponse.data;

describe('useFamilies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial state', () => {
    mockedGetFamilies.mockReturnValue(
      new Promise<PaginatedResponse<Family>>(() => {})
    );

    const { result } = renderHook(() => useFamilies());

    expect(result.current.families).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it('loads families successfully', async () => {
    mockedGetFamilies.mockResolvedValue({
      data: familiesMock
    });

    const { result } = renderHook(() => useFamilies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.families).toEqual(familiesMock);
  });

  it('supports legacy array response shape', async () => {
    mockedGetFamilies.mockResolvedValue(familiesMock);

    const { result } = renderHook(() => useFamilies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.families).toEqual(familiesMock);
  });

  it('does not update state after unmount', async () => {
    let resolvePromise:
      | ((value: PaginatedResponse<Family>) => void)
      | undefined;

    mockedGetFamilies.mockReturnValue(
      new Promise<PaginatedResponse<Family>>((resolve) => {
        resolvePromise = resolve;
      })
    );

    const { result, unmount } = renderHook(() => useFamilies());

    unmount();

    resolvePromise?.({
      data: familiesMock,
      pagination: {
        page: 1,
        limit: 10,
        totalPages: 1,
        totalItems: familiesMock.length
      }
    });

    await Promise.resolve();

    expect(result.current.families).toEqual([]);
    expect(result.current.loading).toBe(true);
  });
});
