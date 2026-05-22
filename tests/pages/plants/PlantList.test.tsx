import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { t } from '../../../src/i18n/core/t';
import PlantList from '../../../src/pages/plants/PlantList';
import { usePlants } from '../../../src/pages/plants/hooks/usePlants';
import { buildPaginationPages } from '../../../src/shared/utils/pagination/buildPaginationPages';
import type { Plant } from '../../../src/types/Plants/Plant';
import { ApiError } from '../../../src/shared/errors/ApiError';

import { listPlantsResponse } from '../../fixtures/plants/listPlants';

vi.mock('../../../src/pages/plants/hooks/usePlants');
vi.mock('../../../src/shared/utils/pagination/buildPaginationPages');

vi.mock('../../../src/pages/plants/PlantCard/PlantCard', () => ({
  default: ({ plant }: { plant: Plant }) => (
    <div>{plant.identity.name.primary}</div>
  )
}));

type UsePlantsReturn = ReturnType<typeof usePlants>;

const mockedUsePlants = vi.mocked(usePlants);
const mockedBuildPaginationPages = vi.mocked(buildPaginationPages);

const plant = listPlantsResponse.data[0];
const pagination = listPlantsResponse.pagination;

function renderWithRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="*" element={<PlantList />} />
      </Routes>
    </MemoryRouter>
  );
}

const baseHookResult: UsePlantsReturn = {
  data: [plant],
  pagination,
  loading: false,
  error: null,
  page: 1,
  limit: 25,
  sortDirection: 'asc',
  setPage: vi.fn(),
  setLimit: vi.fn(),
  setSortDirection: vi.fn()
};

describe('PlantList', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUsePlants.mockReturnValue(baseHookResult);
    mockedBuildPaginationPages.mockReturnValue([1, 2, 3]);
  });

  it('renders loading state', () => {
    mockedUsePlants.mockReturnValue({
      ...baseHookResult,
      loading: true,
      data: [],
      pagination: null
    });

    renderWithRoute('/plants');

    expect(screen.getByText(t('common.loading'))).toBeInTheDocument();
  });

  it('renders title', () => {
    renderWithRoute('/plants');

    expect(screen.getByText(t('plant.plants'))).toBeInTheDocument();
  });

  it('renders plants', () => {
    renderWithRoute('/plants');

    expect(screen.getByText(plant.identity.name.primary)).toBeInTheDocument();
  });

  it('calls buildPaginationPages when pagination exists', () => {
    renderWithRoute('/plants');

    expect(mockedBuildPaginationPages).toHaveBeenCalledWith(
      pagination.page,
      pagination.totalPages
    );
  });

  it('does not call buildPaginationPages when pagination is null', () => {
    mockedUsePlants.mockReturnValue({
      ...baseHookResult,
      pagination: null
    });

    renderWithRoute('/plants');

    expect(mockedBuildPaginationPages).not.toHaveBeenCalled();
  });

  it('renders error state', () => {
    mockedUsePlants.mockReturnValue({
      ...baseHookResult,
      error: new ApiError('Failed to load plants', 500),
      loading: false,
      data: []
    });

    renderWithRoute('/plants');

    expect(screen.getByText(/failed to load plants/i)).toBeInTheDocument();
  });

  it('calls setLimit when limit changes', () => {
    const setLimit = vi.fn();

    mockedUsePlants.mockReturnValue({
      ...baseHookResult,
      setLimit
    });

    renderWithRoute('/plants');

    const select = screen.getByLabelText(/resultados por página/i);

    fireEvent.change(select, { target: { value: '50' } });

    expect(setLimit).toHaveBeenCalledWith(50);
  });

  it('calls setSortDirection when order changes', () => {
    const setSortDirection = vi.fn();

    mockedUsePlants.mockReturnValue({
      ...baseHookResult,
      setSortDirection
    });

    renderWithRoute('/plants');

    const select = screen.getByLabelText(/orden/i);

    fireEvent.change(select, { target: { value: 'desc' } });

    expect(setSortDirection).toHaveBeenCalledWith('desc');
  });

  it('calls setPage when pagination is clicked', () => {
    const setPage = vi.fn();

    mockedUsePlants.mockReturnValue({
      ...baseHookResult,
      setPage
    });

    mockedBuildPaginationPages.mockReturnValue([1, 2, 3]);

    renderWithRoute('/plants');

    const buttons = screen.getAllByTestId(/pagination-button-2/i);

    fireEvent.click(buttons[0]);

    expect(setPage).toHaveBeenCalledWith(2);
  });
});
