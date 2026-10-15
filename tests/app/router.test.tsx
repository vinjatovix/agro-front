import { render, screen } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  createMemoryRouter,
  RouterProvider,
  type RouteObject
} from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { routes } from '../../src/app/router';
import { t } from '../../src/i18n/core/t';
import { createTestQueryClient } from '../test-utils/createTestQueryClient';
import { stubFetchOk } from '../test-utils/stubFetch';
import {
  getUnexpectedErrorReports,
  silenceConsoleError,
  ThrowingChild
} from '../test-utils/unexpectedErrorReports';

function renderRoute(path: string, routeObjects: RouteObject[] = routes) {
  const router = createMemoryRouter(routeObjects, { initialEntries: [path] });
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

  it('shows the app error screen when a layout throws', () => {
    const errorSpy = silenceConsoleError();
    const [authRoute, mainRoute] = routes;
    const failingRoutes: RouteObject[] = [
      authRoute,
      { ...mainRoute, element: <ThrowingChild /> }
    ];

    renderRoute('/plants', failingRoutes);

    expect(
      screen.getByRole('heading', { name: t('errors.app.title') })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: t('errors.actions.reload') })
    ).toBeInTheDocument();
    expect(getUnexpectedErrorReports(errorSpy)).toEqual([
      expect.objectContaining({ kind: 'render', section: 'app' })
    ]);
    errorSpy.mockRestore();
  });

  it.each([
    '/plants',
    '/plants/678efda2-ac3d-4623-81cd-fc1d0ab80315',
    '/families'
  ])('mantiene la estructura uniforme de layout en la ruta %s', (path) => {
    stubFetchOk({
      data: [],
      pagination: { page: 1, limit: 25, totalPages: 0, totalItems: 0 }
    });

    renderRoute(path);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
