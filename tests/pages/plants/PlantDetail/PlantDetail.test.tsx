import '@testing-library/jest-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';

import PlantDetail from '../../../../src/pages/plants/PlantDetail/PlantDetail';
import { getPlantById } from '../../../../src/services/plants.service';
import { ApiError } from '../../../../src/shared/errors/ApiError';
import { NetworkError } from '../../../../src/shared/errors/NetworkError';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';
import { listPlantsResponse } from '../../../fixtures/plants/listPlants';
import {
  buildPlant,
  buildPlantWithEcological,
  buildPlantWithFamily
} from '../../../fixtures/plants/buildPlant';
import { buildFamilySummary } from '../../../fixtures/families/buildFamilySummary';

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

    expect(screen.getByTestId('section-calendario')).toBeInTheDocument();
    expect(screen.getByTestId('section-datos rápidos')).toBeInTheDocument();
    expect(screen.getByTestId('section-cultivo')).toBeInTheDocument();
    expect(screen.getByTestId('section-ecología')).toBeInTheDocument();
    expect(screen.getByTestId('section-notas')).toBeInTheDocument();
  });

  it('renders every section of the full plant without a section notice', async () => {
    mockedGetPlantById.mockResolvedValue(mockPlantWithVideos);

    renderPlantDetail();

    await screen.findByTestId('section-calendario');
    expect(screen.getByTestId('section-datos rápidos')).toBeInTheDocument();
    expect(screen.getByTestId('section-cultivo')).toBeInTheDocument();
    expect(screen.getByTestId('section-ecología')).toBeInTheDocument();
    expect(screen.getByTestId('section-notas')).toBeInTheDocument();
    expect(
      screen.queryByText('No se ha podido mostrar esta sección.')
    ).not.toBeInTheDocument();
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

  it('shows propagation and pruning seasons translated and ordered', async () => {
    mockedGetPlantById.mockResolvedValue(
      buildPlant({
        knowledge: {
          ...mockPlant.knowledge,
          propagation: {
            methods: {
              seed: { seasons: ['summer', 'spring'] },
              cutting: {}
            }
          },
          pruning: [
            {
              type: 'maintenance',
              intensity: 'light',
              seasons: ['winter'],
              frequencyPerYear: 1
            }
          ]
        }
      })
    );

    renderPlantDetail();

    const seedCard = await screen.findByTestId('propagation-seed');
    const cuttingCard = screen.getByTestId('propagation-cutting');
    const pruningCard = screen.getByTestId('pruning-maintenance');

    expect(within(seedCard).getByText('Primavera, Verano')).toBeInTheDocument();
    expect(within(pruningCard).getByText('Invierno')).toBeInTheDocument();
    expect(within(cuttingCard).queryByText(/Estación/)).not.toBeInTheDocument();
    expect(document.body).not.toHaveTextContent('plant.calendar');
  });

  it('shows edible and toxic data between quick facts and cultivation', async () => {
    mockedGetPlantById.mockResolvedValue(
      buildPlantWithEcological({
        edible: true,
        toxic: true,
        toxicityNotes: 'Hojas tóxicas.'
      })
    );

    renderPlantDetail();

    const safety = await screen.findByTestId(
      'section-comestibilidad y toxicidad'
    );
    const quickFacts = screen.getByTestId('section-datos rápidos');
    const cultivation = screen.getByTestId('section-cultivo');

    expect(screen.getByRole('img', { name: 'Comestible' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Tóxica' })).toBeInTheDocument();
    expect(quickFacts.compareDocumentPosition(safety)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(safety.compareDocumentPosition(cultivation)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  it('hides edible and toxic data when the plant has none', async () => {
    mockedGetPlantById.mockResolvedValue(buildPlantWithEcological({}));

    renderPlantDetail();

    await screen.findByTestId('section-cultivo');

    expect(screen.queryByText('Comestibilidad y toxicidad')).toBeNull();
    expect(screen.queryByRole('img', { name: 'Comestible' })).toBeNull();
    expect(screen.queryByRole('img', { name: 'Tóxica' })).toBeNull();
  });

  it.each([
    [
      'a network failure',
      new NetworkError(new TypeError('Failed to fetch')),
      'No se ha podido conectar'
    ],
    [
      'a 500',
      new ApiError('Internal Server Error', 500),
      'El servicio no está disponible'
    ],
    [
      'an error without body',
      new ApiError('API error: 503', 503),
      'El servicio no está disponible'
    ]
  ])(
    'explains %s in Spanish without technical details',
    async (_label, error, expectedText) => {
      mockedGetPlantById.mockRejectedValue(error);

      renderPlantDetail();

      const alert = await screen.findByRole('alert');
      expect(alert).toHaveTextContent(expectedText);
      expect(alert).not.toHaveTextContent(/API error|Internal Server|\d{3}/);
    }
  );

  it('shows the plant after retrying with a good response', async () => {
    mockedGetPlantById.mockRejectedValueOnce(new ApiError('x', 500));
    mockedGetPlantById.mockResolvedValue(mockPlant);

    renderPlantDetail();
    await userEvent.click(
      await screen.findByRole('button', { name: 'Reintentar' })
    );

    expect(
      await screen.findByRole('heading', {
        name: new RegExp(mockPlant.identity.name.primary, 'i')
      })
    ).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps the plant when a refetch fails', async () => {
    mockedGetPlantById.mockResolvedValue(mockPlant);
    const primaryName = new RegExp(mockPlant.identity.name.primary, 'i');

    const { queryClient } = renderPlantDetail();
    await screen.findByRole('heading', { name: primaryName });
    mockedGetPlantById.mockRejectedValue(new ApiError('x', 500));

    await queryClient.refetchQueries();

    expect(
      screen.getByRole('heading', { name: primaryName })
    ).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should render resources section with youtube videos and articles', async () => {
    mockedGetPlantById.mockResolvedValue(mockPlantWithVideos);

    renderPlantDetail();

    const section = await screen.findByTestId('section-recursos');
    expect(section).toBeInTheDocument();

    const articlesTab = document.getElementById('tab-articles');
    expect(articlesTab).toHaveAttribute('aria-selected', 'true');
  });

  it('should switch to videos tab and render videos', async () => {
    const user = userEvent.setup();
    mockedGetPlantById.mockResolvedValue(mockPlantWithVideos);

    renderPlantDetail();
    await screen.findByTestId('section-recursos');

    const videosTab = await screen.getByTestId('tab-videos');
    await user.click(videosTab);

    expect(videosTab).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates to family page when clicking family link', async () => {
    const user = userEvent.setup();
    const family = buildFamilySummary({
      name: 'Solanáceas',
      slug: 'solanaceae'
    });
    const plant = buildPlantWithFamily(family);
    mockedGetPlantById.mockResolvedValue(plant);

    renderWithProviders(
      <Routes>
        <Route path="/plants/:id" element={<PlantDetail />} />
        <Route path="/families/:slug" element={<div>FAMILY PAGE</div>} />
      </Routes>,
      { route: `/plants/${plant.id}` }
    );

    const familyLink = await screen.findByRole('link', {
      name: 'Solanáceas'
    });
    await user.click(familyLink);

    expect(screen.getByText('FAMILY PAGE')).toBeInTheDocument();
  });

  it('does not display family id in the DOM when family is linked', async () => {
    const family = buildFamilySummary({
      id: '5a2380c4-1546-4511-a77b-ec9d3ebcb7cf',
      name: 'Solanáceas',
      slug: 'solanaceae'
    });
    const plant = buildPlantWithFamily(family);
    mockedGetPlantById.mockResolvedValue(plant);

    renderWithProviders(
      <Routes>
        <Route path="/plants/:id" element={<PlantDetail />} />
        <Route path="/families/:slug" element={<div>FAMILY PAGE</div>} />
      </Routes>,
      { route: `/plants/${plant.id}` }
    );

    await screen.findByRole('link', { name: 'Solanáceas' });

    expect(
      screen.queryByText(new RegExp(family.id, 'i'))
    ).not.toBeInTheDocument();
  });

  it('renders unavailable family text when plant has unresolvable family id', async () => {
    const unresolvableId = 'a1d5f8e2-b3c7-4e1a-9f2a-5c9b8d7e1f3a';
    const plant = buildPlantWithFamily(unresolvableId);
    mockedGetPlantById.mockResolvedValue(plant);

    renderWithProviders(<PlantDetail />, {
      route: `/plants/${plant.id}`,
      path: '/plants/:id'
    });

    expect(
      await screen.findByText('Familia no disponible')
    ).toBeInTheDocument();
  });

  it('does not render a family link when plant has unresolvable family id', async () => {
    const unresolvableId = 'a1d5f8e2-b3c7-4e1a-9f2a-5c9b8d7e1f3a';
    const plant = buildPlantWithFamily(unresolvableId);
    mockedGetPlantById.mockResolvedValue(plant);

    renderWithProviders(<PlantDetail />, {
      route: `/plants/${plant.id}`,
      path: '/plants/:id'
    });

    await screen.findByRole('heading', {
      name: new RegExp(plant.identity.name.primary, 'i')
    });

    expect(
      screen.queryByRole('link', { name: /familia/i })
    ).not.toBeInTheDocument();
  });

  it('does not display raw family id in the DOM when plant has unresolvable family id', async () => {
    const unresolvableId = 'a1d5f8e2-b3c7-4e1a-9f2a-5c9b8d7e1f3a';
    const plant = buildPlantWithFamily(unresolvableId);
    mockedGetPlantById.mockResolvedValue(plant);

    renderWithProviders(<PlantDetail />, {
      route: `/plants/${plant.id}`,
      path: '/plants/:id'
    });

    await screen.findByRole('heading', {
      name: new RegExp(plant.identity.name.primary, 'i')
    });

    expect(
      screen.queryByText(new RegExp(unresolvableId, 'i'))
    ).not.toBeInTheDocument();
  });

  it('renders other plant sections normally when plant has unresolvable family id', async () => {
    const unresolvableId = 'a1d5f8e2-b3c7-4e1a-9f2a-5c9b8d7e1f3a';
    const plant = buildPlantWithFamily(unresolvableId);
    mockedGetPlantById.mockResolvedValue(plant);

    renderWithProviders(<PlantDetail />, {
      route: `/plants/${plant.id}`,
      path: '/plants/:id'
    });

    expect(
      await screen.findByTestId('section-datos rápidos')
    ).toBeInTheDocument();
    expect(screen.getByTestId('section-cultivo')).toBeInTheDocument();
    expect(screen.getByTestId('section-notas')).toBeInTheDocument();
  });

  describe('not found', () => {
    const errorSpy = vi.spyOn(console, 'error');

    beforeEach(() => {
      errorSpy.mockClear();
    });

    function expectPlantNotFound() {
      expect(
        screen.getByRole('heading', { level: 1, name: 'Planta no encontrada' })
      ).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent(
        'La planta no existe o ya no está disponible.'
      );
      expect(
        screen.getByRole('link', { name: 'Volver al listado de plantas' })
      ).toHaveAttribute('href', '/plants');
      expect(errorSpy).not.toHaveBeenCalled();
    }

    it.each([404, 400])(
      'shows the plant not found screen on a %i',
      async (status) => {
        mockedGetPlantById.mockRejectedValue(new ApiError('x', status));

        renderPlantDetail();

        await screen.findByRole('heading', {
          level: 1,
          name: 'Planta no encontrada'
        });
        expectPlantNotFound();
      }
    );

    it('shows the plant not found screen without throwing when the id param is missing', () => {
      renderWithProviders(<PlantDetail />, {
        route: '/plants',
        path: '/plants'
      });

      expectPlantNotFound();
      expect(mockedGetPlantById).not.toHaveBeenCalled();
    });
  });
});
