import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import PlantFilters from '../../../../src/components/plants/PlantFilters/PlantFilters';

const mockSetParam = vi.fn();
const mockGetParam = vi.fn();
const mockClearFilters = vi.fn();
const mockSetHemisphere = vi.fn();
const mockHandleTextChange = vi.fn();
const mockSetFamily = vi.fn();

vi.mock('../../../../src/pages/families/hooks/useFamilies', () => ({
  useFamilies: () => ({
    loading: false,
    data: [
      { id: 'family-id', slug: 'rosaceae' },
      { id: 'family-id2', slug: 'lamiaceae' }
    ]
  })
}));

vi.mock(
  '../../../../src/components/plants/PlantFilters/hooks/usePlantFilters',
  () => ({
    usePlantFilters: () => ({
      setParam: mockSetParam,
      getParam: mockGetParam,

      lifeCycle: 'annual',
      sowingMethod: 'direct',
      lightType: 'full_sun',
      rootSystem: 'taproot',

      hemisphere: 'north',
      sowingMonth: 3,

      family: 'family-id',
      setFamily: mockSetFamily,

      textState: {
        identity: 'identity'
      },

      handleTextChange: mockHandleTextChange,

      soilPh: { value: 6, setValue: vi.fn() },
      lightHours: { value: 8, setValue: vi.fn() },
      spacing: { value: 30, setValue: vi.fn() },
      soilDepth: { value: 40, setValue: vi.fn() },

      clearFilters: mockClearFilters,
      setHemisphere: mockSetHemisphere
    })
  })
);

describe('PlantFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetParam.mockReturnValue('');
  });

  function renderComponent() {
    return render(
      <MemoryRouter>
        <PlantFilters />
      </MemoryRouter>
    );
  }

  it('renders identity input', () => {
    renderComponent();
    expect(screen.getByTestId('text-filter-identity')).toBeInTheDocument();
  });

  it('calls handleTextChange when identity input changes', () => {
    renderComponent();

    fireEvent.change(screen.getByTestId('text-filter-identity'), {
      target: { value: 'pepper' }
    });

    expect(mockHandleTextChange).toHaveBeenCalledWith('identity', 'pepper');
  });

  it('calls clearFilters', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('clear-filters'));

    expect(mockClearFilters).toHaveBeenCalled();
  });

  it('calls setFamily from FamilySelect', () => {
    renderComponent();

    const select = screen.getByTestId('family-select');

    fireEvent.change(select, {
      target: { value: 'family-id2' }
    });

    expect(mockSetFamily).toHaveBeenCalledWith('family-id2');
  });

  it('calls setHemisphere', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Sur'));

    expect(mockSetHemisphere).toHaveBeenCalledWith('south');
  });

  it('calls setParam from MonthSelector', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('month-button-5'));

    expect(mockSetParam).toHaveBeenCalledWith('sowingMonth', '5');
  });

  it('calls slider onCommit handlers', () => {
    renderComponent();

    const slider = screen.getByTestId('slider-filter-soilPh');

    (slider as HTMLInputElement).value = '8';

    fireEvent.pointerUp(slider);

    expect(mockSetParam).toHaveBeenCalledWith('soilPh', '8');
  });
});
