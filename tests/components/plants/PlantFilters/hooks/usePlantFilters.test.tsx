import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { usePlantFilters } from '../../../../../src/components/plants/PlantFilters/hooks/usePlantFilters';

const setSearchChangeMock = vi.fn();

function wrapperEmpty({ children }: { children: React.ReactNode }) {
  return <MemoryRouter initialEntries={['/plants']}>{children}</MemoryRouter>;
}

function wrapperWithParams({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter
      initialEntries={[
        '/plants?soilPh=6&lightHoursMin=8&spacingCm=20&soilAvailableDepthCm=30'
      ]}
    >
      {children}
    </MemoryRouter>
  );
}

describe('usePlantFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exposes default params (empty URL)', () => {
    const { result } = renderHook(
      () => usePlantFilters({ onSearchChange: setSearchChangeMock }),
      { wrapper: wrapperEmpty }
    );

    expect(result.current.hemisphere).toBe('north');

    expect(result.current.getParam('lifeCycle')).toBe('');
    expect(result.current.getParam('sowingMethod')).toBe('');
    expect(result.current.getParam('lightType')).toBe('');
    expect(result.current.getParam('rootSystem')).toBe('');

    expect(result.current.family).toBe('');

    expect(result.current.soilPh.value).toBe(null);
    expect(result.current.lightHours.value).toBe(null);
    expect(result.current.spacing.value).toBe(null);
    expect(result.current.soilDepth.value).toBe(null);
  });

  it('initializes sliders from URL params', () => {
    const { result } = renderHook(
      () => usePlantFilters({ onSearchChange: setSearchChangeMock }),
      { wrapper: wrapperWithParams }
    );

    expect(result.current.soilPh.value).toBe(6);
    expect(result.current.lightHours.value).toBe(8);
    expect(result.current.spacing.value).toBe(20);
    expect(result.current.soilDepth.value).toBe(30);
  });

  it('setParam updates query params', () => {
    const { result } = renderHook(
      () => usePlantFilters({ onSearchChange: setSearchChangeMock }),
      { wrapper: wrapperEmpty }
    );

    act(() => {
      result.current.setParam('family', 'abc');
    });

    expect(result.current.getParam('family')).toBe('abc');
  });

  it('setFamily updates param correctly', () => {
    const { result } = renderHook(
      () => usePlantFilters({ onSearchChange: setSearchChangeMock }),
      { wrapper: wrapperEmpty }
    );

    act(() => {
      result.current.setFamily('family-1');
    });

    expect(result.current.getParam('family')).toBe('family-1');
  });

  it('setHemisphere updates param', () => {
    const { result } = renderHook(
      () => usePlantFilters({ onSearchChange: setSearchChangeMock }),
      { wrapper: wrapperEmpty }
    );

    act(() => {
      result.current.setHemisphere('south');
    });

    expect(result.current.getParam('hemisphere')).toBe('south');
  });

  it('syncs textState when text params change after mount', async () => {
    const { result } = renderHook(
      () => usePlantFilters({ onSearchChange: setSearchChangeMock }),
      { wrapper: wrapperEmpty }
    );

    expect(result.current.textState.aliases).toBe('');
    expect(result.current.textState.strategicBenefits).toBe('');

    act(() => {
      result.current.setParam('aliases', 'mint');
    });

    await waitFor(() => {
      expect(result.current.textState.aliases).toBe('mint');
    });

    act(() => {
      result.current.setParam('strategicBenefits', 'high-vitamin');
    });

    await waitFor(() => {
      expect(result.current.textState.strategicBenefits).toBe('high-vitamin');
    });
  });

  it('clearFilters resets URL + sliders + search', () => {
    const { result } = renderHook(
      () => usePlantFilters({ onSearchChange: setSearchChangeMock }),
      { wrapper: wrapperWithParams }
    );

    act(() => {
      result.current.setParam('family', 'abc');
    });

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.getParam('family')).toBe('');
    expect(setSearchChangeMock).toHaveBeenCalledWith('');

    expect(result.current.soilPh.value).toBe(null);
    expect(result.current.lightHours.value).toBe(null);
    expect(result.current.spacing.value).toBe(null);
    expect(result.current.soilDepth.value).toBe(null);
  });

  it('toggles page when setParam is used', () => {
    const { result } = renderHook(
      () => usePlantFilters({ onSearchChange: setSearchChangeMock }),
      { wrapper: wrapperEmpty }
    );

    act(() => {
      result.current.setParam('page', '1');
    });

    expect(result.current.getParam('page')).toBe('1');
  });
});
