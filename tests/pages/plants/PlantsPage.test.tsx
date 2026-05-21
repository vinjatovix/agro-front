import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import PlantsPage from '../../../src/pages/plants/PlantsPage';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

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

function renderPlantsPage() {
  return renderWithProviders(<PlantsPage />);
}

describe('PlantsPage', () => {
  beforeEach(() => {
    isMobile = true;
  });

  it('should always render plant list', () => {
    renderPlantsPage();
    expect(document.querySelector('.plant-grid')).toBeInTheDocument();
  });

  it('should show filters button in mobile', () => {
    renderPlantsPage();
    expect(
      screen.getByRole('button', { name: /^filtros$/i })
    ).toBeInTheDocument();
  });

  it('should NOT show filters button in desktop', () => {
    isMobile = false;
    renderPlantsPage();

    expect(
      screen.queryByRole('button', { name: /^filtros$/i })
    ).not.toBeInTheDocument();
  });

  it('should render sidebar in desktop mode', () => {
    isMobile = false;
    renderPlantsPage();

    expect(document.querySelector('.plants-sidebar')).toBeInTheDocument();
  });

  it('should open drawer when clicking filters button', async () => {
    const user = userEvent.setup();
    renderPlantsPage();

    await user.click(screen.getByRole('button', { name: /^filtros$/i }));

    expect(document.querySelector('.drawer-overlay')).toBeInTheDocument();
  });

  it('should not show drawer initially in mobile', () => {
    renderPlantsPage();

    expect(document.querySelector('.drawer-overlay')).not.toBeInTheDocument();
  });

  it('should not render sidebar in mobile mode', () => {
    renderPlantsPage();

    expect(document.querySelector('.plants-sidebar')).not.toBeInTheDocument();
  });

  it('should not render mobile button in desktop mode', () => {
    isMobile = false;
    renderPlantsPage();

    expect(
      screen.queryByRole('button', { name: /^filtros$/i })
    ).not.toBeInTheDocument();
  });
});
