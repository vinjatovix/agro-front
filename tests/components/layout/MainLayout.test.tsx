import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import MainLayout from '../../../src/components/layout/MainLayout';
import { AuthProvider } from '../../../src/shared/auth/AuthContext';

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
      element: (
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      ),
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

  it('renders banner landmark and main content landmark', () => {
    renderMainLayout();

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders brand logo link pointing to home', () => {
    renderMainLayout();

    const brandLink = screen.getByRole('link', { name: /MiBancal/i });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute('href', '/');
  });

  it('renders menu toggle button with accessibility attributes', () => {
    renderMainLayout();

    const toggleButton = screen.getByRole('button', {
      name: /Menú de navegación/i
    });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(toggleButton).toHaveAttribute('aria-controls', 'app-nav-dialog');
  });

  it('opens nav drawer when toggle button is clicked', async () => {
    const user = userEvent.setup();
    renderMainLayout();

    const toggleButton = screen.getByRole('button', {
      name: /Menú de navegación/i
    });
    await user.click(toggleButton);

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders child route content inside app-content', () => {
    renderMainLayout();

    expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();
  });

  it('invokes ScrollRestoration component', () => {
    renderMainLayout();

    expect(mockScrollRestoration).toHaveBeenCalledTimes(1);
  });
});
