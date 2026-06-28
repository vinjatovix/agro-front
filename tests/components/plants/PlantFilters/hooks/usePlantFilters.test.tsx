import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { usePlantFilters } from '../../../../../src/components/plants/PlantFilters/hooks/usePlantFilters';

function wrapperEmpty({ children }: { children: React.ReactNode }) {
  return <MemoryRouter initialEntries={['/plants']}>{children}</MemoryRouter>;
}

function wrapperWithParams({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter
      initialEntries={[
        '/plants?page=3&soilPh=6&lightHoursMin=8&spacingCm=20&soilAvailableDepthCm=30'
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
    const { result } = renderHook(() => usePlantFilters(), {
      wrapper: wrapperEmpty
    });

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
    const { result } = renderHook(() => usePlantFilters(), {
      wrapper: wrapperWithParams
    });

    expect(result.current.soilPh.value).toBe(6);
    expect(result.current.lightHours.value).toBe(8);
    expect(result.current.spacing.value).toBe(20);
    expect(result.current.soilDepth.value).toBe(30);
  });

  it('setParam updates query params', () => {
    const { result } = renderHook(() => usePlantFilters(), {
      wrapper: wrapperEmpty
    });

    act(() => {
      result.current.setParam('family', 'abc');
    });

    expect(result.current.getParam('family')).toBe('abc');
  });

  it('setFamily updates param correctly', () => {
    const { result } = renderHook(() => usePlantFilters(), {
      wrapper: wrapperEmpty
    });

    act(() => {
      result.current.setFamily('family-1');
    });

    expect(result.current.getParam('family')).toBe('family-1');
  });

  it('setHemisphere updates param', () => {
    const { result } = renderHook(() => usePlantFilters(), {
      wrapper: wrapperEmpty
    });

    act(() => {
      result.current.setHemisphere('south');
    });

    expect(result.current.getParam('hemisphere')).toBe('south');
  });

  it('clearFilters resets URL + sliders + search', () => {
    const { result } = renderHook(() => usePlantFilters(), {
      wrapper: wrapperWithParams
    });

    act(() => {
      result.current.setParam('family', 'abc');
    });

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.getParam('family')).toBe('');
    expect(result.current.getParam('identity')).toBe('');

    expect(result.current.soilPh.value).toBe(null);
    expect(result.current.lightHours.value).toBe(null);
    expect(result.current.spacing.value).toBe(null);
    expect(result.current.soilDepth.value).toBe(null);
  });

  it('sets page param when setParam is used', () => {
    const { result } = renderHook(() => usePlantFilters(), {
      wrapper: wrapperEmpty
    });

    act(() => {
      result.current.setParam('page', '1');
    });

    expect(result.current.getParam('page')).toBe('1');
  });

  it('resets page when any filter changes (bug regression test)', () => {
    const { result } = renderHook(() => usePlantFilters(), {
      wrapper: wrapperWithParams
    });

    act(() => {
      result.current.setParam('family', 'abc');
    });

    expect(result.current.getParam('family')).toBe('abc');

    expect(result.current.getParam('page')).toBe('');
  });
});
