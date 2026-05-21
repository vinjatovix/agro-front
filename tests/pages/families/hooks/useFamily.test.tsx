import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useFamily } from '../../../../src/pages/families/hooks/useFamily';
import { getFamilyById } from '../../../../src/services/families.service';
import { listFamiliesResponse } from '../../../fixtures/families/listFamilies';

vi.mock('../../../../src/services/families.service', () => ({
  getFamilyById: vi.fn()
}));

const familyMock = listFamiliesResponse.data[0];
const mockedGetFamilyById = vi.mocked(getFamilyById);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useFamily', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('loads family successfully', async () => {
    mockedGetFamilyById.mockResolvedValue(familyMock);

    const { result } = renderHook(() => useFamily('family-id'), {
      wrapper
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(familyMock);
    });

    expect(mockedGetFamilyById).toHaveBeenCalledWith('family-id');
  });

  it('returns error when request fails', async () => {
    const error = new Error('Network error');

    mockedGetFamilyById.mockRejectedValue(error);

    const { result } = renderHook(() => useFamily('family-id'), {
      wrapper
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(error);
  });

  it('uses cached data and does not refetch within staleTime', async () => {
    mockedGetFamilyById.mockResolvedValue(familyMock);

    const firstRender = renderHook(() => useFamily('family-id'), {
      wrapper
    });

    await waitFor(() => {
      expect(firstRender.result.current.data).toEqual(familyMock);
    });

    expect(mockedGetFamilyById).toHaveBeenCalledTimes(1);

    firstRender.unmount();
    const secondRender = renderHook(() => useFamily('family-id'), {
      wrapper
    });
    await waitFor(() => {
      expect(secondRender.result.current.data).toEqual(familyMock);
    });

    expect(mockedGetFamilyById).toHaveBeenCalledTimes(1);
  });
});
