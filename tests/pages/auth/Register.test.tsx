import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Register from '../../../src/pages/auth/Register';
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
      <Route path="/login" element={<div>Página de login</div>} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

describe('Register Page', () => {
  beforeEach(() => {
    sessionStorage.clear();
    clearStoredToken();
    vi.restoreAllMocks();
  });

  it('redirects to home if user is already authenticated', () => {
    setStoredToken(VALID_TEST_TOKEN);

    renderWithProviders(<TestApp />, { route: '/register' });

    expect(screen.getByText('Página principal')).toBeInTheDocument();
  });

  it('keeps submit button disabled when form fields are missing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TestApp />, { route: '/register' });

    await user.type(
      screen.getByLabelText(/Correo electrónico/i),
      'hortelano@example.com'
    );

    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeDisabled();
  });

  it('enables submit button when all fields are valid', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TestApp />, { route: '/register' });

    await user.type(
      screen.getByLabelText(/Correo electrónico/i),
      'hortelano@example.com'
    );
    await user.type(screen.getByLabelText(/Nombre de usuario/i), 'hortelano');
    await user.type(screen.getByLabelText(/^Contraseña/i), 'Password123!');
    await user.type(
      screen.getByLabelText(/Repetir contraseña/i),
      'Password123!'
    );

    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeEnabled();
  });

  it.each([
    ['weak password', 'abc', 'Débil'],
    ['medium password', 'Password12', 'Media'],
    ['strong password', 'Password123!', 'Fuerte']
  ])(
    'displays %s strength indicator (%s)',
    async (_, passwordValue, expectedLabel) => {
      const user = userEvent.setup();
      renderWithProviders(<TestApp />, { route: '/register' });

      await user.type(screen.getByLabelText(/^Contraseña/i), passwordValue);

      expect(screen.getByText(expectedLabel)).toBeInTheDocument();
    }
  );

  it('shows password mismatch error in real time when repeat password does not match', async () => {
    const user = userEvent.setup();

    renderWithProviders(<TestApp />, { route: '/register' });

    await user.type(screen.getByLabelText(/^Contraseña/i), 'Password123!');
    await user.type(
      screen.getByLabelText(/Repetir contraseña/i),
      'DifferentPass123!'
    );

    expect(
      await screen.findByText('Las contraseñas no coinciden')
    ).toBeInTheDocument();
  });

  it('submits valid registration and shows neutral confirmation message', async () => {
    const user = userEvent.setup();
    const registerSpy = vi
      .spyOn(authServiceModule, 'register')
      .mockResolvedValueOnce(undefined);

    renderWithProviders(<TestApp />, { route: '/register' });

    await user.type(
      screen.getByLabelText(/Correo electrónico/i),
      'hortelano@example.com'
    );
    await user.type(screen.getByLabelText(/Nombre de usuario/i), 'hortelano');
    await user.type(screen.getByLabelText(/^Contraseña/i), 'Password123!');
    await user.type(
      screen.getByLabelText(/Repetir contraseña/i),
      'Password123!'
    );

    const submitButton = screen.getByRole('button', { name: 'Crear cuenta' });
    expect(submitButton).toBeEnabled();
    await user.click(submitButton);

    expect(registerSpy).toHaveBeenCalledTimes(1);
    const dto = registerSpy.mock.calls[0][0];
    expect(dto.email).toBe('hortelano@example.com');
    expect(dto.username).toBe('hortelano');
    expect(dto.password).toBe('Password123!');
    expect(dto.repeatPassword).toBe('Password123!');
    expect(typeof dto.id).toBe('string');
    expect(dto.id.length).toBe(36);

    expect(
      await screen.findByText('Revisa tu correo para activar la cuenta')
    ).toBeInTheDocument();
    expect(sessionStorage.getItem('auth_token')).toBeNull();
  });

  it('handles 409 conflict by marking username in use', async () => {
    const user = userEvent.setup();
    vi.spyOn(authServiceModule, 'register').mockRejectedValueOnce(
      new ApiError('Username already in use', 409)
    );

    renderWithProviders(<TestApp />, { route: '/register' });

    await user.type(
      screen.getByLabelText(/Correo electrónico/i),
      'hortelano@example.com'
    );
    await user.type(screen.getByLabelText(/Nombre de usuario/i), 'hortelano');
    await user.type(screen.getByLabelText(/^Contraseña/i), 'Password123!');
    await user.type(
      screen.getByLabelText(/Repetir contraseña/i),
      'Password123!'
    );
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(
      await screen.findByText(
        'El nombre de usuario ya está en uso. Por favor, elige otro.'
      )
    ).toBeInTheDocument();
  });

  it('handles 429 rate limit error', async () => {
    const user = userEvent.setup();
    vi.spyOn(authServiceModule, 'register').mockRejectedValueOnce(
      new ApiError('Too many requests', 429)
    );

    renderWithProviders(<TestApp />, { route: '/register' });

    await user.type(
      screen.getByLabelText(/Correo electrónico/i),
      'hortelano@example.com'
    );
    await user.type(screen.getByLabelText(/Nombre de usuario/i), 'hortelano');
    await user.type(screen.getByLabelText(/^Contraseña/i), 'Password123!');
    await user.type(
      screen.getByLabelText(/Repetir contraseña/i),
      'Password123!'
    );
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(
      await screen.findByText(
        'Demasiados intentos. Por favor, inténtalo más tarde.'
      )
    ).toBeInTheDocument();
  });

  it('renders link to login page', () => {
    renderWithProviders(<TestApp />, { route: '/register' });

    const loginLink = screen.getByRole('link', {
      name: /¿Ya tienes cuenta\? Inicia sesión/i
    });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
