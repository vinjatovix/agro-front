import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PlantsPage from '../../../src/pages/plants/PlantsPage';
import { renderWithRouter } from '../../test-utils/renderWithRouter';

let isMobile = true;

vi.mock('../../../src/shared/hooks/useMediaQuery', () => ({
  default: () => isMobile
}));

vi.mock('../../../src/pages/plants/hooks/usePlants', () => ({
  usePlants: () => ({
    plants: [],
    loading: false,
    pagination: null,
    page: 1,
    limit: 25,
    setPage: vi.fn(),
    setLimit: vi.fn()
  })
}));

describe('PlantsPage', () => {
  beforeEach(() => {
    isMobile = true;
  });

  it('should always render plant list', () => {
    renderWithRouter(<PlantsPage />);
    expect(document.querySelector('.plant-grid')).toBeInTheDocument();
  });

  it('should show filters button in mobile', () => {
    renderWithRouter(<PlantsPage />);
    expect(
      screen.getByRole('button', { name: /^filters$/i })
    ).toBeInTheDocument();
  });

  it('should NOT show filters button in desktop', () => {
    isMobile = false;
    renderWithRouter(<PlantsPage />);

    expect(
      screen.queryByRole('button', { name: /^filters$/i })
    ).not.toBeInTheDocument();
  });

  it('should render sidebar in desktop mode', () => {
    isMobile = false;
    renderWithRouter(<PlantsPage />);

    expect(document.querySelector('.plants-sidebar')).toBeInTheDocument();
  });

  it('should open drawer when clicking filters button', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PlantsPage />);

    await user.click(screen.getByRole('button', { name: /^filters$/i }));

    const overlay = document.querySelector('.drawer-overlay');
    expect(overlay).toBeInTheDocument();
  });

  it('should not show drawer initially in mobile', () => {
    renderWithRouter(<PlantsPage />);

    const overlay = document.querySelector('.drawer-overlay');
    expect(overlay).not.toBeInTheDocument();
  });

  it('should not render sidebar in mobile mode', () => {
    renderWithRouter(<PlantsPage />);

    expect(document.querySelector('.plants-sidebar')).not.toBeInTheDocument();
  });

  it('should not render mobile button in desktop mode', () => {
    isMobile = false;
    renderWithRouter(<PlantsPage />);

    expect(
      screen.queryByRole('button', { name: /^filters$/i })
    ).not.toBeInTheDocument();
  });
});
