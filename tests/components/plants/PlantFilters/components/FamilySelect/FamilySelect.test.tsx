import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FamilySelect from '../../../../../../src/components/plants/PlantFilters/components/FamilySelect/FamilySelect';

const mockUseFamilies = vi.fn();

vi.mock('../../../../../../src/shared/hooks/useFamilies', () => ({
  useFamilies: () => mockUseFamilies()
}));

describe('FamilySelect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFamilies.mockReturnValue({
      loading: false,
      data: [
        { id: 'f-1', name: 'amarilidáceas', slug: 'amaryllidaceae' },
        { id: 'f-2', name: 'solanáceas', slug: 'solanaceae' }
      ]
    });
  });

  it('renders initial reset option with empty value and all families label', () => {
    render(<FamilySelect value="" onChange={vi.fn()} />);

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveValue('');
    expect(options[0]).toHaveTextContent('Todas las familias');
  });

  it.each([
    { name: 'amarilidáceas', expected: 'Amarilidáceas' },
    { name: 'apiáceas', expected: 'Apiáceas' },
    { name: 'solanáceas', expected: 'Solanáceas' }
  ])('displays capitalized Spanish name for $name', ({ name, expected }) => {
    mockUseFamilies.mockReturnValue({
      loading: false,
      data: [{ id: 'test-id', name, slug: 'test-slug' }]
    });

    render(<FamilySelect value="" onChange={vi.fn()} />);

    expect(screen.getByRole('option', { name: expected })).toBeInTheDocument();
  });

  it('sorts family options alphabetically using Spanish locale collation', () => {
    mockUseFamilies.mockReturnValue({
      loading: false,
      data: [
        { id: 'f-3', name: 'solanáceas', slug: 'solanaceae' },
        { id: 'f-1', name: 'amarilidáceas', slug: 'amaryllidaceae' },
        { id: 'f-4', name: 'ásteres', slug: 'asteraceae' },
        { id: 'f-2', name: 'brassicáceas', slug: 'brassicaceae' }
      ]
    });

    render(<FamilySelect value="" onChange={vi.fn()} />);

    const options = screen.getAllByRole('option');
    const optionTexts = options.map((opt) => opt.textContent);
    expect(optionTexts).toEqual([
      'Todas las familias',
      'Amarilidáceas',
      'Ásteres',
      'Brassicáceas',
      'Solanáceas'
    ]);
  });

  it('maintains family UUID id as option value', () => {
    mockUseFamilies.mockReturnValue({
      loading: false,
      data: [
        {
          id: 'd0a3b923-c1ac-4796-afa4-1c801ff1a4a3',
          name: 'amarilidáceas',
          slug: 'amaryllidaceae'
        }
      ]
    });

    render(<FamilySelect value="" onChange={vi.fn()} />);

    expect(screen.getByRole('option', { name: 'Amarilidáceas' })).toHaveValue(
      'd0a3b923-c1ac-4796-afa4-1c801ff1a4a3'
    );
  });

  it('calls onChange callback with family id when user selects an option', () => {
    const handleChange = vi.fn();
    render(<FamilySelect value="" onChange={handleChange} />);

    const select = screen.getByTestId('family-select');
    fireEvent.change(select, { target: { value: 'f-2' } });

    expect(handleChange).toHaveBeenCalledWith('f-2');
  });

  it('disables the select input while families are loading', () => {
    mockUseFamilies.mockReturnValue({
      loading: true,
      data: []
    });

    render(<FamilySelect value="" onChange={vi.fn()} />);

    expect(screen.getByTestId('family-select')).toBeDisabled();
  });

  it('renders loading option while families are loading', () => {
    mockUseFamilies.mockReturnValue({
      loading: true,
      data: []
    });

    render(<FamilySelect value="" onChange={vi.fn()} />);

    const loadingOption = screen.getByRole('option', { name: 'Cargando...' });
    expect(loadingOption).toHaveValue('');
  });

  it('disables the select input when families query fails', () => {
    mockUseFamilies.mockReturnValue({
      loading: false,
      error: new Error('Network error'),
      data: []
    });

    render(<FamilySelect value="" onChange={vi.fn()} />);

    expect(screen.getByTestId('family-select')).toBeDisabled();
  });

  it('indicates invalid state via aria-invalid when families query fails', () => {
    mockUseFamilies.mockReturnValue({
      loading: false,
      error: new Error('Network error'),
      data: []
    });

    render(<FamilySelect value="" onChange={vi.fn()} />);

    expect(screen.getByTestId('family-select')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('renders unknown error option when families query fails', () => {
    mockUseFamilies.mockReturnValue({
      loading: false,
      error: new Error('Network error'),
      data: []
    });

    render(<FamilySelect value="" onChange={vi.fn()} />);

    const errorOption = screen.getByRole('option', {
      name: 'Error desconocido'
    });
    expect(errorOption).toHaveValue('');
  });
});
