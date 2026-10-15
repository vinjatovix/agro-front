import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MainLayout from '../../../src/components/layout/MainLayout';

const mockScrollRestoration = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    ScrollRestoration: () => {
      mockScrollRestoration();
      return null;
    }
  };
});

function renderMainLayout() {
  const router = createMemoryRouter([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <div>Contenido de prueba</div>
        }
      ]
    }
  ]);

  return render(<RouterProvider router={router} />);
}

describe('MainLayout', () => {
  beforeEach(() => {
    mockScrollRestoration.mockClear();
  });

  it.each([
    ['cabecera', 'banner'],
    ['navegación', 'navigation'],
    ['contenido principal', 'main']
  ] as const)(
    'renderiza el landmark estructural de %s (%s)',
    (_label, role) => {
      renderMainLayout();

      expect(screen.getByRole(role)).toBeInTheDocument();
    }
  );

  it('renderiza el contenido hijo de la ruta dentro de app-content', () => {
    renderMainLayout();

    expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();
  });

  it('renderiza el componente ScrollRestoration para gestionar el historial de scroll', () => {
    renderMainLayout();

    expect(mockScrollRestoration).toHaveBeenCalledTimes(1);
  });
});
