import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Plant } from '../../../src/types/Plant';
import { usePlants } from '../../../src/pages/plants/hooks/usePlants';
import { buildPaginationPages } from '../../../src/shared/utils/pagination/buildPaginationPages';
import { PaginationResult } from '../../../src/types/Pagination';
import PlantList from '../../../src/pages/plants/PlantList';
import { PlantCardProps } from '../../../src/pages/plants/PlantCard';
import { listPlantsResponse } from '../../fixtures/plants/listPlants';

vi.mock('../../../src/pages/plants/hooks/usePlants');

vi.mock('../../../src/shared/utils/pagination/buildPaginationPages', () => ({
  buildPaginationPages: vi.fn()
}));

vi.mock('../../../src/pages/plants/PlantCard', () => ({
  default: ({ plant }: PlantCardProps) => (
    <div>{plant.identity.name.primary}</div>
  )
}));

interface LimitSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

vi.mock('../../../src/shared/components/LimitSelector', () => ({
  default: ({ value, onChange }: LimitSelectorProps) => (
    <button type="button" onClick={() => onChange(50)}>
      LimitSelector-{value}
    </button>
  )
}));

interface PaginationProps {
  pages: (number | '...')[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

vi.mock('../../../src/shared/components/Pagination', () => ({
  default: ({ currentPage, onPageChange }: PaginationProps) => (
    <button type="button" onClick={() => onPageChange(3)}>
      Pagination-{currentPage}
    </button>
  )
}));

const setPage = vi.fn<(page: number) => void>();
const setLimit = vi.fn<(limit: number) => void>();

const mockedUsePlants = vi.mocked(usePlants);
const mockedBuildPaginationPages = vi.mocked(buildPaginationPages);

const plant: Plant = listPlantsResponse.data[0];

const pagination: PaginationResult = listPlantsResponse.pagination;

type UsePlantsReturn = ReturnType<typeof usePlants>;

const baseHookResult: UsePlantsReturn = {
  plants: [plant],

  loading: false,

  pagination,

  page: 1,
  limit: 25,

  setPage,
  setLimit
};

describe('PlantList', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedBuildPaginationPages.mockReturnValue([1, 2, 3]);

    mockedUsePlants.mockReturnValue(baseHookResult);
  });

  it('renders loading state', () => {
    const loadingResult: UsePlantsReturn = {
      ...baseHookResult,
      plants: [],
      loading: true,
      pagination: null
    };

    mockedUsePlants.mockReturnValue(loadingResult);

    render(<PlantList search="" />);

    expect(screen.getByText('Loading plants...')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<PlantList search="" />);

    expect(screen.getByText('Plants')).toBeInTheDocument();
  });

  it('renders plants', () => {
    render(<PlantList search="" />);

    expect(screen.getByText(plant.identity.name.primary)).toBeInTheDocument();
  });

  it('calls buildPaginationPages with current page and total pages', () => {
    render(<PlantList search="" />);

    expect(mockedBuildPaginationPages).toHaveBeenCalledWith(
      pagination.page,
      pagination.totalPages
    );
  });

  it('renders pagination twice', () => {
    render(<PlantList search="" />);

    expect(screen.getAllByText(`Pagination-${pagination.page}`)).toHaveLength(
      2
    );
  });

  it('passes limit changes to setLimit', () => {
    render(<PlantList search="" />);

    fireEvent.click(screen.getByText('LimitSelector-25'));

    expect(setLimit).toHaveBeenCalledWith(50);
  });

  it('passes page changes to setPage', () => {
    render(<PlantList search="" />);

    fireEvent.click(screen.getAllByText('Pagination-1')[0]);

    expect(setPage).toHaveBeenCalledWith(3);
  });

  it('does not build pagination pages when pagination is null', () => {
    const noPaginationResult: UsePlantsReturn = {
      ...baseHookResult,
      pagination: null
    };

    mockedUsePlants.mockReturnValue(noPaginationResult);

    render(<PlantList search="" />);

    expect(mockedBuildPaginationPages).not.toHaveBeenCalled();
  });
});
