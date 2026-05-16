import '@testing-library/jest-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import PlantDetail from '../../../../src/pages/plants/PlantDetail/PlantDetail';
import { listPlantsResponse } from '../../../fixtures/plants/listPlants';
import { getPlantById } from '../../../../src/services/plants.service';

vi.mock('../../../../src/services/plants.service', () => ({
  getPlantById: vi.fn()
}));

const mockPlant = listPlantsResponse.data[0];
const mockPlantWithVideos = listPlantsResponse.data[1];

function renderPlantDetail() {
  return render(
    <MemoryRouter initialEntries={[`/plants/${mockPlant.id}`]}>
      <Routes>
        <Route path="/plants/:id" element={<PlantDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('PlantDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.mocked(getPlantById).mockImplementation(() => new Promise(() => {}));

    renderPlantDetail();

    expect(screen.getByText(/Cargando planta/i)).toBeInTheDocument();
  });

  it('should render plant information', async () => {
    vi.mocked(getPlantById).mockResolvedValue(mockPlant);

    renderPlantDetail();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /perejil/i })
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/petroselinum crispum/i)).toBeInTheDocument();

    expect(screen.getByTestId('section-📅 calendario')).toBeInTheDocument();
    expect(screen.getByTestId('section-⚡ datos rápidos')).toBeInTheDocument();
    expect(screen.getByTestId('section-🌱 cultivo')).toBeInTheDocument();
    expect(screen.getByTestId('section-🌿 ecología')).toBeInTheDocument();
    expect(screen.getByTestId('section-📝 notas')).toBeInTheDocument();
  });

  it('should change hemisphere', async () => {
    const user = userEvent.setup();
    vi.mocked(getPlantById).mockResolvedValue(mockPlant);

    renderPlantDetail();

    await screen.findByRole('heading', { name: /perejil/i });

    const southBtn = screen.getByRole('button', { name: /sur/i });
    await user.click(southBtn);

    expect(southBtn).toHaveClass('hemisphere-toggle__btn--active');
  });

  it('should render propagation methods', async () => {
    vi.mocked(getPlantById).mockResolvedValue(mockPlant);

    renderPlantDetail();

    const card = await screen.findByTestId('propagation-seed');

    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent('Macerar semillas 24h antes de siembra');
  });

  it('should render pruning information', async () => {
    vi.mocked(getPlantById).mockResolvedValue(mockPlant);

    renderPlantDetail();

    const pruningCard = await screen.findByTestId('pruning-maintenance');

    expect(pruningCard).toBeInTheDocument();

    expect(pruningCard).toHaveTextContent(/Mantenimiento/i);
    expect(pruningCard).toHaveTextContent(/Moderada/i);
    expect(pruningCard).toHaveTextContent(/Primavera/i);
  });

  it('should render error when service fails', async () => {
    vi.mocked(getPlantById).mockRejectedValue(new Error('Plant not found'));
    renderPlantDetail();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/plant not found/i);
    });
  });

  it('should render resources section with youtube videos and articles', async () => {
    vi.mocked(getPlantById).mockResolvedValue(mockPlantWithVideos);

    renderPlantDetail();

    const section = await screen.findByTestId('section-📚 recursos');
    const articlesTab = document.getElementById(
      'tab-articles'
    ) as HTMLButtonElement;
    const articleLinks = await screen.findAllByRole('link');

    expect(section).toBeInTheDocument();
    expect(articleLinks.length).toBeGreaterThan(0);
    expect(articlesTab).toBeInTheDocument();
    expect(articlesTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should switch to videos tab and render videos', async () => {
    vi.mocked(getPlantById).mockResolvedValue(mockPlantWithVideos);

    renderPlantDetail();

    await screen.findByTestId('section-📚 recursos');

    const videosTab = document.getElementById(
      'tab-videos'
    ) as HTMLButtonElement;
    await userEvent.click(videosTab);

    expect(videosTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByTestId('resource-video')).toHaveLength(2);
  });
});
