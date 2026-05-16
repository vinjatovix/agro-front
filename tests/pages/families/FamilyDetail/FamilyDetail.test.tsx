import '@testing-library/jest-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import FamilyDetail from '../../../../src/pages/families/FamilyDetail/FamilyDetail';

import { getFamilyById } from '../../../../src/services/families.service';
import { getPlants } from '../../../../src/services/plants.service';
import { listFamiliesResponse } from '../../../fixtures/families/listFamilies';
import { listPlantsResponse } from '../../../fixtures/plants/listPlants';

vi.mock('../../../../src/services/families.service', () => ({
  getFamilyById: vi.fn()
}));

vi.mock('../../../../src/services/plants.service', () => ({
  getPlants: vi.fn()
}));

const mockFamily = listFamiliesResponse.data[0];
const mockPlants = listPlantsResponse;

function renderFamilyDetail() {
  return render(
    <MemoryRouter initialEntries={[`/families/${mockFamily.id}`]}>
      <Routes>
        <Route path="/families/:id" element={<FamilyDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('FamilyDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    vi.mocked(getFamilyById).mockImplementation(() => new Promise(() => {}));
    vi.mocked(getPlants).mockImplementation(() => new Promise(() => {}));

    renderFamilyDetail();

    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();
  });

  it('should render family information and plants', async () => {
    vi.mocked(getFamilyById).mockResolvedValue(mockFamily);
    vi.mocked(getPlants).mockResolvedValue(mockPlants);

    renderFamilyDetail();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: new RegExp(mockFamily.name, 'i') })
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
    vi.mocked(getFamilyById).mockResolvedValue(mockFamily);
    vi.mocked(getPlants).mockResolvedValue(mockPlants);

    renderFamilyDetail();

    const links = await screen.findAllByRole('link');

    expect(links.length).toBeGreaterThan(0);
  });

  it('should render error state', async () => {
    vi.mocked(getFamilyById).mockRejectedValue(new Error('Family not found'));
    vi.mocked(getPlants).mockResolvedValue({ ...mockPlants, data: [] });

    renderFamilyDetail();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/family not found/i);
    });
  });
});
