import '@testing-library/jest-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';

import FamilyDetail from '../../../../src/pages/families/FamilyDetail/FamilyDetail';
import { getFamilyById } from '../../../../src/services/families.service';
import { getPlants } from '../../../../src/services/plants.service';

import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { listFamiliesResponse } from '../../../fixtures/families/listFamilies';
import { listPlantsResponse } from '../../../fixtures/plants/listPlants';

vi.mock('../../../../src/services/families.service', () => ({
  getFamilyById: vi.fn()
}));

vi.mock('../../../../src/services/plants.service', () => ({
  getPlants: vi.fn()
}));

const mockedGetFamilyById = vi.mocked(getFamilyById);
const mockedGetPlants = vi.mocked(getPlants);

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
    mockedGetPlants.mockImplementation(() => new Promise(() => {}));

    renderFamilyDetail();

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render family information and plants', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetPlants.mockResolvedValue(mockPlants);

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

    expect(screen.getByTestId(/section-📝 Descripción/i)).toBeInTheDocument();
    expect(screen.getByTestId(/section-🌟 Destacados/i)).toBeInTheDocument();
    expect(screen.getByTestId(/section-🌿 Plantas/i)).toBeInTheDocument();
  });

  it('should render plants list links', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetPlants.mockResolvedValue(mockPlants);

    renderFamilyDetail();

    const links = await screen.findAllByRole('link');

    expect(links.length).toBeGreaterThan(0);
  });

  it('should render error state', async () => {
    mockedGetFamilyById.mockRejectedValue(new Error('Family not found'));

    mockedGetPlants.mockResolvedValue({
      ...mockPlants,
      data: []
    });

    renderFamilyDetail();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/family not found/i);
    });
  });

  it('should render plants error state', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);

    mockedGetPlants.mockRejectedValue(new Error('Plants failed'));

    renderFamilyDetail();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/plants failed/i);
    });
  });

  it('should keep loading while plants are loading even if family is ready', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);

    mockedGetPlants.mockImplementation(() => new Promise(() => {}));

    renderFamilyDetail();

    await waitFor(() => {
      expect(mockedGetFamilyById).toHaveBeenCalled();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  it('loads plants with family uuid when accessed by slug', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetPlants.mockResolvedValue(mockPlants);

    renderWithProviders(<FamilyDetail />, {
      route: `/families/${mockFamily.slug}`,
      path: '/families/:id'
    });

    await waitFor(() => {
      expect(mockedGetPlants).toHaveBeenCalledWith({
        family: mockFamily.id
      });
    });
  });

  it('displays plants when accessed by slug', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetPlants.mockResolvedValue(mockPlants);

    renderWithProviders(<FamilyDetail />, {
      route: `/families/${mockFamily.slug}`,
      path: '/families/:id'
    });

    await waitFor(() => {
      expect(screen.getByTestId(/section-🌿 Plantas/i)).toBeInTheDocument();
    });
  });

  it('propagates total plants count to family plants section', async () => {
    mockedGetFamilyById.mockResolvedValue(mockFamily);
    mockedGetPlants.mockResolvedValue({
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
    mockedGetPlants.mockResolvedValue(mockPlants);

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
    mockedGetPlants.mockResolvedValue({
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
    mockedGetPlants.mockResolvedValue({
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

  it('renders error state when id param is missing', () => {
    renderWithProviders(<FamilyDetail />, {
      route: '/families',
      path: '/families'
    });

    const alert = screen.getByRole('alert');

    expect(alert).toHaveTextContent('Familia no encontrada');
  });
});
