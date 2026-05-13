import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { usePlants } from '../../../../src/pages/plants/hooks/usePlants';

// mock service
import * as plantsService from '../../../../src/services/plants.service';
import { listPlantsResponse } from '../../../fixtures/plants/listPlants';
import { SUPPORTED_LIMITS } from '../../../../src/shared/components/constants';

type WrapperProps = {
  children: React.ReactNode;
  initialEntries: string[];
};

function createWrapper({ initialEntries, children }: WrapperProps) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="*" element={children} />
      </Routes>
    </MemoryRouter>
  );
}

describe('usePlants', () => {
  beforeEach(() => {
    vi.spyOn(plantsService, 'getPlants').mockResolvedValue(listPlantsResponse);
  });

  it('parses default page and limit', async () => {
    const { result } = renderHook(() => usePlants(''), {
      wrapper: ({ children }) =>
        createWrapper({
          initialEntries: ['/plants'],
          children
        })
    });

    await waitFor(() => {
      expect(result.current.page).toBe(1);
      expect(result.current.limit).toBe(SUPPORTED_LIMITS[0]);
    });
  });

  it('setPage updates URL correctly', async () => {
    const { result } = renderHook(() => usePlants(''), {
      wrapper: ({ children }) =>
        createWrapper({
          initialEntries: ['/plants?page=1'],
          children
        })
    });

    act(() => {
      result.current.setPage(3);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(3);
    });
  });

  it('setLimit resets page to 1', async () => {
    const { result } = renderHook(() => usePlants(''), {
      wrapper: ({ children }) =>
        createWrapper({
          initialEntries: ['/plants?page=5&limit=25'],
          children
        })
    });

    act(() => {
      result.current.setLimit(SUPPORTED_LIMITS[1]);
    });

    await waitFor(() => {
      expect(result.current.limit).toBe(SUPPORTED_LIMITS[1]);
      expect(result.current.page).toBe(1);
    });
  });

  it('filters plants by search', async () => {
    const { result } = renderHook(
      () => usePlants(listPlantsResponse.data[0].identity.name.aliases![0]),
      {
        wrapper: ({ children }) =>
          createWrapper({
            initialEntries: ['/plants'],
            children
          })
      }
    );

    await waitFor(() => {
      expect(result.current.plants.length).toBe(listPlantsResponse.data.length);
    });
  });

  it('exposes loading state', async () => {
    const { result } = renderHook(() => usePlants(''), {
      wrapper: ({ children }) =>
        createWrapper({
          initialEntries: ['/plants'],
          children
        })
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
