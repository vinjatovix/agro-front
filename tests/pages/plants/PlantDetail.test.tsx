import '@testing-library/jest-dom';

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import { getPlantById } from '../../../src/services/plants.service';
import { Plant } from '../../../src/types/Plant';
import { listPlantsResponse } from '../../fixtures/plants/listPlants';
import PlantDetail from '../../../src/pages/plants/PlantDetail/PlantDetail';

vi.mock('../../../src/services/plants.service', () => ({
  getPlantById: vi.fn()
}));

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );

  return {
    ...actual,
    useParams: () => ({ id: 'plant-1' })
  };
});

vi.mock('../../../src/pages/plants/utils/findPlantImage', () => ({
  findPlantImage: () => 'https://image.test/plant.jpg'
}));

vi.mock('../../../src/shared/utils/capitalizeFirstLetter', () => ({
  capitalizeFirstLetter: (value: string) => value
}));

const mockedGetPlantById = vi.mocked(getPlantById);

const plant: Plant = listPlantsResponse.data[0];

describe('PlantDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    mockedGetPlantById.mockReturnValue(new Promise(() => {}));

    render(<PlantDetail />);

    expect(screen.getByText('Loading plant...')).toBeInTheDocument();
  });

  // it('renders plant data when loaded', async () => {
  //   const scientificName = plant.identity.scientificName;
  //   mockedGetPlantById.mockResolvedValue(plant);

  //   render(<PlantDetail />);

  //   await waitFor(() => {
  //     expect(screen.getByText(plant.identity.name.primary)).toBeInTheDocument();
  //   });
  //   expect(scientificName).toBeDefined();
  //   expect(screen.getByText(scientificName!)).toBeInTheDocument();
  //   expect(screen.getByText(plant.identity.family)).toBeInTheDocument();
  // });

  it('renders image when available', async () => {
    mockedGetPlantById.mockResolvedValue(plant);

    render(<PlantDetail />);

    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://image.test/plant.jpg');
    });
  });

  it('renders not found when plant is null', async () => {
    mockedGetPlantById.mockResolvedValue(null as unknown as Plant);

    render(<PlantDetail />);

    await waitFor(() => {
      expect(screen.getByText('Plant not found')).toBeInTheDocument();
    });
  });

  // it('renders traits section correctly', async () => {
  //   mockedGetPlantById.mockResolvedValue(plant);

  //   render(<PlantDetail />);

  //   await waitFor(() => {
  //     expect(screen.getByText('Traits')).toBeInTheDocument();
  //   });

  //   expect(screen.getByText(plant.traits.lifecycle)).toBeInTheDocument();
  //   expect(
  //     screen.getByText(
  //       `${plant.traits.spacingCm.min} - ${plant.traits.spacingCm.max} cm`
  //     )
  //   ).toBeInTheDocument();
  // });

  // it('renders phenology raw months', async () => {
  //   mockedGetPlantById.mockResolvedValue(plant);

  //   render(<PlantDetail />);

  //   await waitFor(() => {
  //     expect(
  //       screen.getByText(plant.phenology.sowing.months.join(', '))
  //     ).toBeInTheDocument();
  //   });

  //   expect(
  //     screen.getByText(plant.phenology.sowing.months.join(', '))
  //   ).toBeInTheDocument();
  // });
});
