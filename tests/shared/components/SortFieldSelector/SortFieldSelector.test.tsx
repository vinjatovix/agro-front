import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SortFieldSelector from '../../../../src/shared/components/SortFieldSelector/SortFieldSelector';

const OPTIONS = [
  { value: 'name', label: 'Nombre común' },
  { value: 'scientificName', label: 'Nombre científico' }
] as const;

type Field = (typeof OPTIONS)[number]['value'];

function renderSelector(value: Field, onChange = vi.fn()) {
  render(
    <SortFieldSelector<Field>
      id="sort-field"
      label="Ordenar por"
      value={value}
      options={OPTIONS}
      onChange={onChange}
    />
  );
  return onChange;
}

describe('SortFieldSelector', () => {
  it('es un combobox accesible por su etiqueta con las opciones recibidas', () => {
    renderSelector('name');

    const select = screen.getByRole('combobox', { name: /^Ordenar por:?$/ });
    expect(select).toBeInTheDocument();
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Nombre común',
      'Nombre científico'
    ]);
  });

  it('refleja el valor recibido', () => {
    renderSelector('scientificName');

    expect(screen.getByRole('combobox')).toHaveValue('scientificName');
  });

  it('al elegir otra opción llama a onChange con su valor', async () => {
    const onChange = renderSelector('name');

    await userEvent.selectOptions(
      screen.getByRole('combobox'),
      'Nombre científico'
    );

    expect(onChange).toHaveBeenCalledWith('scientificName');
  });
});
