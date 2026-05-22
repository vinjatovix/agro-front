import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { useFamilies } from '../../../../src/pages/families/hooks/useFamilies';
import { getFamilies } from '../../../../src/services/families.service';
import type { Family } from '../../../../src/types/Family';

import { listFamiliesResponse } from '../../../fixtures/families/listFamilies';
import { createTestQueryClient } from '../../../test-utils/createTestQueryClient';

vi.mock('../../../../src/services/families.service', () => ({
  getFamilies: vi.fn()
}));

const mockedGetFamilies = vi.mocked(getFamilies);
const familiesMock: Family[] = listFamiliesResponse.data;

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useFamilies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial state', () => {
    mockedGetFamilies.mockResolvedValue({
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        totalPages: 0,
        totalItems: 0
      }
    });

    const { result } = renderHook(() => useFamilies(), { wrapper });

    expect(result.current.data).toEqual([]);
  });

  it('loads families successfully', async () => {
    mockedGetFamilies.mockResolvedValue(listFamiliesResponse);

    const { result } = renderHook(() => useFamilies(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(familiesMock);
    });
  });
});
