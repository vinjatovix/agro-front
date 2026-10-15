import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CatalogHeader from '../../../../../src/pages/plants/components/CatalogHeader/CatalogHeader';

const formatEs = (value: number) => new Intl.NumberFormat('es').format(value);

describe('CatalogHeader', () => {
  it('muestra el total de especies con separador de miles', () => {
    render(<CatalogHeader totalItems={1842} summary="" />);

    expect(screen.getByText(`${formatEs(1842)} especies`)).toBeInTheDocument();
  });

  it('muestra "0 especies" con cero resultados', () => {
    render(<CatalogHeader totalItems={0} summary="" />);

    expect(screen.getByText('0 especies')).toBeInTheDocument();
  });

  it('muestra el resumen por segmentos cuando hay filtros', () => {
    render(
      <CatalogHeader totalItems={10} summary="Filtrado activo: Perenne" />
    );

    expect(screen.getByText('Filtrado activo: Perenne')).toBeInTheDocument();
  });

  it('omite el resumen sin filtros', () => {
    render(<CatalogHeader totalItems={10} summary="" />);

    expect(screen.queryByText(/Filtrado activo/)).not.toBeInTheDocument();
  });

  it('no muestra recuentos mientras el total es desconocido', () => {
    render(<CatalogHeader totalItems={undefined} summary="" />);

    expect(screen.queryByText(/especies/)).not.toBeInTheDocument();
  });
});
