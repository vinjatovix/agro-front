import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import PlantFilters from '../../../../src/components/plants/PlantFilters/PlantFilters';

const mockSetParam = vi.fn();
const mockGetParam = vi.fn();
const mockClearFilters = vi.fn();
const mockSetHemisphere = vi.fn();
const mockHandleTextChange = vi.fn();
const mockSetFamily = vi.fn();
const mockBooleans: { edible?: string; toxic?: string } = {};

vi.mock('../../../../src/shared/hooks/useFamilies', () => ({
  useFamilies: () => ({
    loading: false,
    error: null,
    data: [
      { id: 'family-id', slug: 'rosaceae', name: 'rosáceas' },
      { id: 'family-id2', slug: 'lamiaceae', name: 'lamiáceas' }
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
      edible: mockBooleans.edible,
      toxic: mockBooleans.toxic,

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
    mockBooleans.edible = undefined;
    mockBooleans.toxic = undefined;
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

  it('limits the search input to the contract FilterText length', () => {
    renderComponent();
    expect(screen.getByTestId('text-filter-identity')).toHaveAttribute(
      'maxlength',
      '200'
    );
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

  it.each([
    ['Ciclo de vida', 'Anual'],
    ['Método de siembra', 'Directa'],
    ['Tipo de luz', 'Sol pleno'],
    ['Sistema radicular', 'Pivotante']
  ])('the %s group keeps its Spanish labels', (group, option) => {
    renderComponent();

    const toggle = screen.getByRole('group', { name: new RegExp(group) });

    expect(
      within(toggle).getByRole('button', { name: option })
    ).toBeInTheDocument();
  });

  it.each(['Comestible', 'Tóxica'])(
    'renders the %s group with any, yes and no options',
    (name) => {
      renderComponent();

      const group = screen.getByRole('group', { name: new RegExp(name) });

      expect(
        within(group)
          .getAllByRole('button')
          .map((button) => button.textContent)
      ).toEqual(['Cualquiera', 'Sí', 'No']);
      expect(
        within(group).getByRole('button', { name: 'Cualquiera' })
      ).toHaveAttribute('aria-pressed', 'true');
      expect(within(group).getByRole('button', { name: 'Sí' })).toHaveAttribute(
        'aria-pressed',
        'false'
      );
      expect(group).toHaveAccessibleDescription(
        'Elegir «No» excluye las plantas sin dato.'
      );
    }
  );

  it('shows the boolean hint once', () => {
    renderComponent();

    expect(
      screen.getAllByText('Elegir «No» excluye las plantas sin dato.')
    ).toHaveLength(1);
  });

  it('marks the URL value as pressed', () => {
    mockBooleans.edible = 'true';
    mockBooleans.toxic = 'false';

    renderComponent();

    const edible = screen.getByRole('group', { name: /Comestible/ });
    const toxic = screen.getByRole('group', { name: /Tóxica/ });

    expect(within(edible).getByRole('button', { name: 'Sí' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(within(toxic).getByRole('button', { name: 'No' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it.each([
    ['Sí', 'true'],
    ['No', 'false'],
    ['Cualquiera', undefined]
  ])('choosing %s sets edible to %s', (option, value) => {
    mockBooleans.edible = 'true';
    renderComponent();

    const group = screen.getByRole('group', { name: /Comestible/ });
    fireEvent.click(within(group).getByRole('button', { name: option }));

    expect(mockSetParam).toHaveBeenCalledWith('edible', value);
  });

  it('the boolean options work with the keyboard', async () => {
    const user = userEvent.setup();
    renderComponent();

    const group = screen.getByRole('group', { name: /Tóxica/ });
    const any = within(group).getByRole('button', { name: 'Cualquiera' });
    const yes = within(group).getByRole('button', { name: 'Sí' });
    const no = within(group).getByRole('button', { name: 'No' });

    any.focus();
    await user.tab();
    expect(yes).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(mockSetParam).toHaveBeenLastCalledWith('toxic', 'true');

    await user.tab();
    expect(no).toHaveFocus();
    await user.keyboard(' ');
    expect(mockSetParam).toHaveBeenLastCalledWith('toxic', 'false');
  });
});
