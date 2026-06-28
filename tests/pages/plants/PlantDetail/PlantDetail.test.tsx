import '@testing-library/jest-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';

import PlantDetail from '../../../../src/pages/plants/PlantDetail/PlantDetail';
import { getPlantById } from '../../../../src/services/plants.service';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { listPlantsResponse } from '../../../fixtures/plants/listPlants';

vi.mock('../../../../src/services/plants.service', () => ({
  getPlantById: vi.fn()
}));

const mockedGetPlantById = vi.mocked(getPlantById);

const mockPlant = listPlantsResponse.data[0];
const mockPlantWithVideos = listPlantsResponse.data[1];

function renderPlantDetail() {
  return renderWithProviders(<PlantDetail />, {
    route: `/plants/${mockPlant.id}`,
    path: '/plants/:id'
  });
}

describe('PlantDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockedGetPlantById.mockImplementation(() => new Promise(() => {}));

    renderPlantDetail();

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render plant information', async () => {
    mockedGetPlantById.mockResolvedValue(mockPlant);

    renderPlantDetail();

    const regexPrimaryName = new RegExp(mockPlant.identity.name.primary, 'i');
    const regexScientific = new RegExp(
      `^${mockPlant.identity.scientificName}$`,
      'i'
    );

    expect(
      await screen.findByRole('heading', { name: regexPrimaryName })
    ).toBeInTheDocument();
    expect(screen.getByText(regexScientific)).toBeInTheDocument();

    expect(screen.getByTestId('section-📅 calendario')).toBeInTheDocument();
    expect(screen.getByTestId('section-⚡ datos rápidos')).toBeInTheDocument();
    expect(screen.getByTestId('section-🌱 cultivo')).toBeInTheDocument();
    expect(screen.getByTestId('section-🌿 ecología')).toBeInTheDocument();
    expect(screen.getByTestId('section-📝 notas')).toBeInTheDocument();
  });

  it('should change hemisphere', async () => {
    const user = userEvent.setup();
    mockedGetPlantById.mockResolvedValue(mockPlant);

    renderPlantDetail();

    const southBtn = await screen.findByRole('button', { name: /sur/i });
    await user.click(southBtn);

    expect(southBtn).toHaveClass('hemisphere-toggle__btn--active');
  });

  it('should render propagation methods', async () => {
    mockedGetPlantById.mockResolvedValue(mockPlant);

    renderPlantDetail();

    const card = await screen.findByTestId('propagation-seed');

    expect(card).toBeInTheDocument();
  });

  it('should render pruning information', async () => {
    mockedGetPlantById.mockResolvedValue(mockPlant);

    renderPlantDetail();

    const pruningCard = await screen.findByTestId('pruning-maintenance');

    expect(pruningCard).toBeInTheDocument();
  });

  it('should render error when service fails', async () => {
    mockedGetPlantById.mockRejectedValue(new Error('Plant not found'));

    renderPlantDetail();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /plant not found/i
    );
  });

  it('should render resources section with youtube videos and articles', async () => {
    mockedGetPlantById.mockResolvedValue(mockPlantWithVideos);

    renderPlantDetail();

    const section = await screen.findByTestId('section-📚 recursos');
    expect(section).toBeInTheDocument();

    const articlesTab = document.getElementById('tab-articles');
    expect(articlesTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should switch to videos tab and render videos', async () => {
    const user = userEvent.setup();
    mockedGetPlantById.mockResolvedValue(mockPlantWithVideos);

    renderPlantDetail();
    await screen.findByTestId('section-📚 recursos');

    const videosTab = await screen.getByTestId('tab-videos');
    await user.click(videosTab);

    expect(videosTab).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates to family page when clicking family badge', async () => {
    const user = userEvent.setup();
    mockedGetPlantById.mockResolvedValue(mockPlant);

    renderWithProviders(
      <Routes>
        <Route path="/plants/:id" element={<PlantDetail />} />
        <Route path="/families/:id" element={<div>FAMILY PAGE</div>} />
      </Routes>,
      { route: `/plants/${mockPlant.id}` }
    );

    const familyLink = await screen.findByRole('link', {
      name: new RegExp(mockPlant.identity.family, 'i')
    });

    await user.click(familyLink);

    expect(screen.getByText('FAMILY PAGE')).toBeInTheDocument();
  });
});
