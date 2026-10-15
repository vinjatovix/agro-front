import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import AuthLayout from '../../../src/components/layout/AuthLayout';
import Login from '../../../src/pages/auth/Login';
import Register from '../../../src/pages/auth/Register';

describe('Auth layout and pages icons', () => {
  it('renders AuthLayout heading with accessible lock icon', () => {
    render(
      <MemoryRouter>
        <AuthLayout />
      </MemoryRouter>
    );

    const headingIcon = screen.getByRole('img', { name: 'Acceso' });

    expect(headingIcon).toBeInTheDocument();
  });

  it('renders Login page with accessible login icon', () => {
    render(<Login />);

    const loginIcon = screen.getByRole('img', { name: 'Iniciar sesión' });

    expect(loginIcon).toBeInTheDocument();
  });

  it('renders Register page with accessible person_add icon', () => {
    render(<Register />);

    const registerIcon = screen.getByRole('img', { name: 'Crear cuenta' });

    expect(registerIcon).toBeInTheDocument();
  });
});
