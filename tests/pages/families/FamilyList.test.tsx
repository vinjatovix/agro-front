import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';

import FamilyList from '../../../src/pages/families/FamilyList';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

vi.mock('../../../src/pages/families/hooks/useFamilies', () => ({
  useFamilies: vi.fn()
}));

import { useFamilies } from '../../../src/pages/families/hooks/useFamilies';
import { listFamiliesResponse } from '../../fixtures/families/listFamilies';
import { t } from '../../../src/i18n/core/t';

const mockedUseFamilies = vi.mocked(useFamilies);

describe('FamilyList', () => {
  it('shows loading state', () => {
    mockedUseFamilies.mockReturnValue({
      families: [],
      loading: true,
      error: null
    });

    renderWithProviders(<FamilyList />);

    expect(screen.getByText(t('common.loading'))).toBeInTheDocument();
  });

  it('renders families', () => {
    mockedUseFamilies.mockReturnValue({
      loading: false,
      families: listFamiliesResponse.data,
      error: null
    });

    renderWithProviders(<FamilyList />);

    expect(
      screen.getByText(listFamiliesResponse.data[0].name)
    ).toBeInTheDocument();
    expect(
      screen.getByText(listFamiliesResponse.data[0].scientificName)
    ).toBeInTheDocument();

    expect(
      screen.getByText(listFamiliesResponse.data[1].scientificName)
    ).toBeInTheDocument();
    expect(
      screen.getByText(listFamiliesResponse.data[1].name)
    ).toBeInTheDocument();
  });

  it('creates links to family detail', () => {
    mockedUseFamilies.mockReturnValue({
      loading: false,
      families: listFamiliesResponse.data,
      error: null
    });

    renderWithProviders(<FamilyList />);

    const links = screen.getAllByRole('link');

    expect(links[0]).toHaveAttribute(
      'href',
      `/families/${listFamiliesResponse.data[0].id}`
    );

    expect(links[1]).toHaveAttribute(
      'href',
      `/families/${listFamiliesResponse.data[1].id}`
    );
  });
});
