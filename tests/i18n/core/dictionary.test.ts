import { describe, expect, it } from 'vitest';

import { t } from '../../../src/i18n/core/t';

describe('auth and admin dictionary keys', () => {
  it.each([
    ['app.brand', 'MiBancal'],
    [
      'app.welcome_message',
      'Bienvenido a MiBancal, tu guía de cultivo de plantas.'
    ],
    ['app.nav.menu', 'Menú de navegación'],
    ['auth.heading', 'Acceso'],
    ['auth.login', 'Iniciar sesión'],
    ['auth.show_password', 'Mostrar contraseña'],
    ['auth.hide_password', 'Ocultar contraseña'],
    ['auth.register', 'Crear cuenta'],
    ['auth.logout', 'Cerrar sesión'],
    ['admin.heading', 'Administración']
  ] as const)('translates %s to %s', (key, expected) => {
    const result = t(key);

    expect(result).toBe(expected);
  });
});

describe('clear_range dictionary key with interpolation', () => {
  it.each([
    [{ label: 'altura' }, 'Quitar filtro de altura'],
    [{ label: 'Separación' }, 'Quitar filtro de Separación'],
    [{ label: 'Profundidad de suelo' }, 'Quitar filtro de Profundidad de suelo']
  ])('interpolates label parameter into %s', (params, expected) => {
    const result = t('plant.filters.clear_range', params);

    expect(result).toBe(expected);
  });
});
