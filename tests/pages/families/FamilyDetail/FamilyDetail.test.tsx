import '@testing-library/jest-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FamilyDetail from '../../../../src/pages/families/FamilyDetail/FamilyDetail';
import { getFamilyById } from '../../../../src/services/families.service';
import { getFamilyPlants } from '../../../../src/services/plants.service';
import { ApiError } from '../../../../src/shared/errors/ApiError';
import { NetworkError } from '../../../../src/shared/errors/NetworkError';

import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { listFamiliesResponse } from '../../../fixtures/families/listFamilies';
import { listPlantsResponse } from '../../../fixtures/plants/listPlants';

vi.mock('../../../../src/services/families.service', () => ({
  getFamilyById: vi.fn()
}));

vi.mock('../../../../src/services/plants.service', () => ({
  getFamilyPlants: vi.fn()
}));

const mockedGetFamilyById = vi.mocked(getFamilyById);
const mockedGetFamilyPlants = vi.mocked(getFamilyPlants);

const mockFamily = listFamiliesResponse.data[0];
const mockPlants = listPlantsResponse;

function renderFamilyDetail() {
  return renderWithProviders(<FamilyDetail />, {
    route: `/families/${mockFamily.id}`,
    path: '/families/:id'
  });
}

describe('FamilyDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    mockedGetFamilyById.mockImplementation(() => new Promise(() => {}));
    mockedGetFamilyPlants.mockImplementation(() => new Promise(() => {}));

    renderFamilyDetail();

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render family information and plants', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetFamilyPlants.mockResolvedValue(mockPlants);

    renderFamilyDetail();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: new RegExp(mockFamily.name, 'i')
        })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(new RegExp(mockFamily.scientificName, 'i'))
    ).toBeInTheDocument();

    expect(screen.getByTestId(/section-descripción/i)).toBeInTheDocument();
    expect(screen.getByTestId(/section-destacados/i)).toBeInTheDocument();
    expect(screen.getByTestId(/section-plantas/i)).toBeInTheDocument();
  });

  it('renders hero, info and plants sections without a section notice', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetFamilyPlants.mockResolvedValue(mockPlants);

    renderFamilyDetail();

    await screen.findByTestId('family-plants-count');
    expect(
      screen.getByRole('heading', { name: new RegExp(mockFamily.name, 'i') })
    ).toBeInTheDocument();
    expect(screen.getByTestId(/section-descripción/i)).toBeInTheDocument();
    expect(
      screen.queryByText('No se ha podido mostrar esta sección.')
    ).not.toBeInTheDocument();
  });

  it('should render plants list links', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetFamilyPlants.mockResolvedValue(mockPlants);

    renderFamilyDetail();

    const links = await screen.findAllByRole('link');

    expect(links.length).toBeGreaterThan(0);
  });

  it('explains a failed family request in Spanish and retries it', async () => {
    mockedGetFamilyById.mockRejectedValueOnce(
      new NetworkError(new TypeError('Failed to fetch'))
    );
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetFamilyPlants.mockResolvedValue(mockPlants);

    renderFamilyDetail();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se ha podido conectar'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(
      await screen.findByRole('heading', {
        name: new RegExp(mockFamily.name, 'i')
      })
    ).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows the plants error only inside the plants section, keeping hero and info', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetFamilyPlants.mockRejectedValue(
      new ApiError('Internal Server Error', 500)
    );

    renderFamilyDetail();

    const plantsSection = await screen.findByTestId(/section-plantas/i);
    expect(await within(plantsSection).findByRole('alert')).toHaveTextContent(
      'El servicio no está disponible'
    );
    expect(
      screen.getByRole('heading', { name: new RegExp(mockFamily.name, 'i') })
    ).toBeInTheDocument();
    expect(screen.getByTestId(/section-descripción/i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).not.toHaveTextContent(/500|Internal/);
  });

  it('retries the plants request from its section', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetFamilyPlants.mockRejectedValueOnce(new ApiError('x', 503));
    mockedGetFamilyPlants.mockResolvedValue(mockPlants);

    renderFamilyDetail();

    await userEvent.click(
      await screen.findByRole('button', { name: 'Reintentar' })
    );

    expect(
      await screen.findByTestId('family-plants-count')
    ).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows the plants loader inside its section once the family is ready', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetFamilyPlants.mockImplementation(() => new Promise(() => {}));

    renderFamilyDetail();

    const plantsSection = await screen.findByTestId(/section-plantas/i);
    expect(within(plantsSection).getByRole('status')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: new RegExp(mockFamily.name, 'i') })
    ).toBeInTheDocument();
  });

  it('keeps the family and its plants when a refetch fails', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetFamilyPlants.mockResolvedValue(mockPlants);

    const { queryClient } = renderFamilyDetail();
    await screen.findByTestId('family-plants-count');
    mockedGetFamilyById.mockRejectedValue(new ApiError('x', 500));
    mockedGetFamilyPlants.mockRejectedValue(new ApiError('x', 500));

    await queryClient.refetchQueries();

    expect(screen.getByTestId('family-plants-count')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: new RegExp(mockFamily.name, 'i') })
    ).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('loads plants with family uuid when accessed by slug', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetFamilyPlants.mockResolvedValue(mockPlants);

    renderWithProviders(<FamilyDetail />, {
      route: `/families/${mockFamily.slug}`,
      path: '/families/:id'
    });

    await waitFor(() => {
      expect(mockedGetFamilyPlants).toHaveBeenCalledWith(mockFamily.id);
    });
  });

  it('displays plants when accessed by slug', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetFamilyPlants.mockResolvedValue(mockPlants);

    renderWithProviders(<FamilyDetail />, {
      route: `/families/${mockFamily.slug}`,
      path: '/families/:id'
    });

    await waitFor(() => {
      expect(screen.getByTestId(/section-plantas/i)).toBeInTheDocument();
    });
  });

  it('propagates total plants count to family plants section', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetFamilyPlants.mockResolvedValue({
      data: mockPlants.data,
      pagination: {
        page: 1,
        limit: 25,
        totalPages: 2,
        totalItems: 30
      }
    });

    renderFamilyDetail();

    await waitFor(() => {
      expect(screen.getByTestId('family-plants-count')).toHaveTextContent(
        `Mostrando ${mockPlants.data.length} de 30 plantas`
      );
    });
  });

  it('renders CTA link to plants catalog prefiltered by family uuid when plants are available', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetFamilyPlants.mockResolvedValue(mockPlants);

    renderFamilyDetail();

    await waitFor(() => {
      expect(screen.getByTestId('family-plants-view-all')).toHaveAttribute(
        'href',
        `/plants?family=${mockFamily.id}`
      );
    });
  });

  it('displays empty state message when family has zero plants', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetFamilyPlants.mockResolvedValue({
      data: [],
      pagination: {
        page: 1,
        limit: 25,
        totalPages: 0,
        totalItems: 0
      }
    });

    renderFamilyDetail();

    await waitFor(() => {
      expect(screen.getByTestId('family-plants-empty')).toBeInTheDocument();
    });
  });

  it('hides CTA link when family has zero plants', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetFamilyPlants.mockResolvedValue({
      data: [],
      pagination: {
        page: 1,
        limit: 25,
        totalPages: 0,
        totalItems: 0
      }
    });

    renderFamilyDetail();

    await waitFor(() => {
      expect(
        screen.queryByTestId('family-plants-view-all')
      ).not.toBeInTheDocument();
    });
  });

  function expectFamilyNotFound() {
    expect(
      screen.getByRole('heading', { level: 1, name: 'Familia no encontrada' })
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      'La familia no existe.'
    );
    expect(
      screen.getByRole('link', { name: 'Volver al listado de familias' })
    ).toHaveAttribute('href', '/families');
  }

  it.each([404, 400])(
    'shows the family not found screen on a %i',
    async (status) => {
      mockedGetFamilyById.mockRejectedValue(new ApiError('x', status));

      renderFamilyDetail();

      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: 'Familia no encontrada'
        })
      ).toBeInTheDocument();
      expectFamilyNotFound();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    }
  );

  it('shows the family not found screen when the id param is missing', () => {
    renderWithProviders(<FamilyDetail />, {
      route: '/families',
      path: '/families'
    });

    expectFamilyNotFound();
    expect(mockedGetFamilyById).not.toHaveBeenCalled();
  });
});
