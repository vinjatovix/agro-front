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
});
