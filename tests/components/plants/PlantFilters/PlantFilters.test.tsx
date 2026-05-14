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
        aliases: 'alias',
        strategicBenefits: 'benefit'
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

vi.mock(
  '../../../../src/components/plants/PlantFilters/components/FamilySelect/FamilySelect',
  () => ({
    default: ({ onChange }: { onChange: (v: string) => void }) => (
      <button onClick={() => onChange('family-id')}>FamilySelect</button>
    )
  })
);

vi.mock(
  '../../../../src/components/plants/PlantFilters/components/MonthSelector',
  () => ({
    default: ({ onChange }: { onChange: (v: string) => void }) => (
      <button onClick={() => onChange('5')}>MonthSelector</button>
    )
  })
);

vi.mock(
  '../../../../src/components/plants/PlantFilters/components/TextFilter',
  () => ({
    default: ({
      label,
      onChange
    }: {
      label: string;
      onChange: (v: string) => void;
    }) => <button onClick={() => onChange('updated')}>{label}</button>
  })
);

vi.mock('../../../../src/components/plants/SliderFilter', () => ({
  default: ({
    label,
    onCommit
  }: {
    label: string;
    onCommit: (v: number | null) => void;
  }) => <button onClick={() => onCommit(10)}>{label}</button>
}));

vi.mock('../../../../src/components/plants/ToggleGroup', () => ({
  default: ({
    label,
    onChange
  }: {
    label: string;
    onChange: (v: string) => void;
  }) => <button onClick={() => onChange('south')}>{label}</button>
}));

describe('PlantFilters', () => {
  const onSearchChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetParam.mockReturnValue('');
  });

  function renderComponent() {
    return render(
      <MemoryRouter>
        <PlantFilters search="" onSearchChange={onSearchChange} />
      </MemoryRouter>
    );
  }

  it('renders search control (mocked)', () => {
    renderComponent();
    expect(screen.getByText('Search plants')).toBeInTheDocument();
  });

  it('calls onSearchChange when search changes', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Search plants'));

    expect(onSearchChange).toHaveBeenCalledWith('updated');
  });

  it('calls clearFilters', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Clear filters'));

    expect(mockClearFilters).toHaveBeenCalled();
  });

  it('calls setFamily from FamilySelect', () => {
    renderComponent();

    fireEvent.click(screen.getByText('FamilySelect'));

    expect(mockSetFamily).toHaveBeenCalledWith('family-id');
  });

  it('calls setHemisphere', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Hemisphere'));

    expect(mockSetHemisphere).toHaveBeenCalledWith('south');
  });

  it('calls setParam from MonthSelector', () => {
    renderComponent();

    fireEvent.click(screen.getByText('MonthSelector'));

    expect(mockSetParam).toHaveBeenCalledWith('sowingMonth', '5');
  });

  it('calls text filter handlers', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Alias'));
    fireEvent.click(screen.getByText('Strategic benefits'));

    expect(mockHandleTextChange).toHaveBeenCalledWith('aliases', 'updated');
    expect(mockHandleTextChange).toHaveBeenCalledWith(
      'strategicBenefits',
      'updated'
    );
  });

  it('calls slider onCommit handlers', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Soil pH'));

    expect(mockSetParam).toHaveBeenCalledWith('soilPh', '10');
  });
});
