import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import OrderSelector from '../../../../src/shared/components/OrderSelector/OrderSelector';

describe('OrderSelector component', () => {
  it('renders options without arrow prefixes', () => {
    render(
      <OrderSelector
        value="asc"
        labelAsc="Nombre A-Z"
        labelDes="Nombre Z-A"
        onChange={vi.fn()}
      />
    );

    const ascOption = screen.getByRole('option', { name: 'Nombre A-Z' });
    const descOption = screen.getByRole('option', { name: 'Nombre Z-A' });

    expect(ascOption).toBeInTheDocument();
    expect(descOption).toBeInTheDocument();
    expect(ascOption).toHaveTextContent(/^Nombre A-Z$/);
    expect(descOption).toHaveTextContent(/^Nombre Z-A$/);
  });
});
