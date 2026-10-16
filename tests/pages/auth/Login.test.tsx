import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Login from '../../../src/pages/auth/Login';
import * as authServiceModule from '../../../src/services/auth.service';
import {
  clearStoredToken,
  setStoredToken
} from '../../../src/shared/auth/session';
import { ApiError } from '../../../src/shared/errors/ApiError';
import { VALID_TEST_TOKEN } from '../../fixtures/auth/authFixtures';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

function TestApp() {
  return (
    <Routes>
      <Route path="/" element={<div>Página principal</div>} />
      <Route path="/admin" element={<div>Panel de administración</div>} />
      <Route path="/register" element={<div>Página de registro</div>} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

describe('Login Page', () => {
  beforeEach(() => {
    sessionStorage.clear();
    clearStoredToken();
    vi.restoreAllMocks();
  });

  it('redirects to home if user is already authenticated', () => {
    setStoredToken(VALID_TEST_TOKEN);

    renderWithProviders(<TestApp />, {
      route: '/login'
    });

    expect(screen.getByText('Página principal')).toBeInTheDocument();
  });

  it('validates required fields on client without calling API', async () => {
    const user = userEvent.setup();
    const loginSpy = vi.spyOn(authServiceModule, 'login');

    renderWithProviders(<TestApp />, {
      route: '/login'
    });

    const submitButton = screen.getByRole('button', { name: 'Iniciar sesión' });
    await user.click(submitButton);

    expect(loginSpy).not.toHaveBeenCalled();
    expect(screen.getAllByText('Campo obligatorio')).toHaveLength(2);
  });

  it('validates email format on client', async () => {
    const user = userEvent.setup();
    const loginSpy = vi.spyOn(authServiceModule, 'login');

    renderWithProviders(<TestApp />, {
      route: '/login'
    });

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: 'Iniciar sesión' });

    await user.type(emailInput, 'correo-invalido');
    await user.type(passwordInput, 'Password123!');
    await user.click(submitButton);

    expect(loginSpy).not.toHaveBeenCalled();
    expect(
      screen.getByText('Introduce una dirección de correo válida')
    ).toBeInTheDocument();
  });

  it('logs in successfully and redirects to home', async () => {
    const user = userEvent.setup();
    vi.spyOn(authServiceModule, 'login').mockResolvedValueOnce({
      token: VALID_TEST_TOKEN
    });

    renderWithProviders(<TestApp />, {
      route: '/login'
    });

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: 'Iniciar sesión' });

    await user.type(emailInput, 'hortelano@example.com');
    await user.type(passwordInput, 'Password123!');
    await user.click(submitButton);

    expect(await screen.findByText('Página principal')).toBeInTheDocument();
  });

  it('shows uniform error message and activation notice on 401', async () => {
    const user = userEvent.setup();
    vi.spyOn(authServiceModule, 'login').mockRejectedValueOnce(
      new ApiError('Unauthorized', 401)
    );

    renderWithProviders(<TestApp />, {
      route: '/login'
    });

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: 'Iniciar sesión' });

    await user.type(emailInput, 'hortelano@example.com');
    await user.type(passwordInput, 'WrongPassword!');
    await user.click(submitButton);

    expect(
      await screen.findByText('Credenciales no válidas')
    ).toBeInTheDocument();
    expect(
      screen.getByText('¿No has activado tu cuenta? Revisa tu correo')
    ).toBeInTheDocument();
  });

  it('handles 429 rate limit error showing localized message', async () => {
    const user = userEvent.setup();
    vi.spyOn(authServiceModule, 'login').mockRejectedValueOnce(
      new ApiError('Too Many Requests', 429)
    );

    renderWithProviders(<TestApp />, {
      route: '/login'
    });

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole('button', { name: 'Iniciar sesión' });

    await user.type(emailInput, 'hortelano@example.com');
    await user.type(passwordInput, 'Password123!');
    await user.click(submitButton);

    expect(
      await screen.findByText(
        'Demasiados intentos. Por favor, inténtalo más tarde.'
      )
    ).toBeInTheDocument();
  });

  it('contains link to register page', () => {
    renderWithProviders(<TestApp />, {
      route: '/login'
    });

    const registerLink = screen.getByRole('link', {
      name: /¿No tienes cuenta\? Regístrate/i
    });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('redirects to originating location including search query and hash', () => {
    setStoredToken(VALID_TEST_TOKEN);

    renderWithProviders(
      <Routes>
        <Route path="/" element={<div>Página principal</div>} />
        <Route path="/plants" element={<div>Listado de plantas</div>} />
        <Route path="/login" element={<Login />} />
      </Routes>,
      {
        route: {
          pathname: '/login',
          state: {
            from: {
              pathname: '/plants',
              search: '?cycle=annual',
              hash: '#gallery'
            }
          }
        }
      }
    );

    expect(screen.getByText('Listado de plantas')).toBeInTheDocument();
  });

  it.each([
    ['login itself', '/login'],
    ['register page', '/register'],
    ['protocol relative url', '//malicious.example.com']
  ])('falls back to home when origin is %s', (_, unsafePath) => {
    setStoredToken(VALID_TEST_TOKEN);

    renderWithProviders(
      <Routes>
        <Route path="/" element={<div>Página principal</div>} />
        <Route path="/login" element={<Login />} />
      </Routes>,
      {
        route: {
          pathname: '/login',
          state: {
            from: {
              pathname: unsafePath
            }
          }
        }
      }
    );

    expect(screen.getByText('Página principal')).toBeInTheDocument();
  });
});
