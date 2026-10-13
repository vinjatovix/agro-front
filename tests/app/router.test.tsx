import { render, screen } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { routes } from '../../src/app/router';
import { t } from '../../src/i18n/core/t';
import { createTestQueryClient } from '../test-utils/createTestQueryClient';

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
  return router;
}

describe('router', () => {
  it('shows the not found page on an unknown route keeping the layout and the URL', () => {
    const router = renderRoute('/ruta-inventada');

    expect(
      screen.getByRole('heading', { level: 1, name: t('notFound.title') })
    ).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/ruta-inventada');
    expect(router.state.historyAction).toBe('POP');
  });
});
