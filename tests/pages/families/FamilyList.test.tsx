import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, within } from '@testing-library/react';

import FamilyList from '../../../src/pages/families/FamilyList';
import { getFamilyList } from '../../../src/services/families.service';
import type { FamilyListItem } from '../../../src/types/Family';
import { listFamilyItems } from '../../fixtures/families/listFamilyItems';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

vi.mock('../../../src/services/families.service', () => ({
  getFamilyList: vi.fn()
}));

const mockedGetFamilyList = vi.mocked(getFamilyList);
const [firstFamily, secondFamily] = listFamilyItems;

function resolveFamilies(data: FamilyListItem[]) {
  mockedGetFamilyList.mockResolvedValue(data);
}

async function findFamilyLinks(): Promise<HTMLElement[]> {
  return screen.findAllByRole('link');
}

describe('FamilyList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetFamilyList.mockResolvedValue(listFamilyItems);
  });

  it('shows loading state', () => {
    mockedGetFamilyList.mockImplementation(
      () => new Promise<FamilyListItem[]>(() => {})
    );

    renderWithProviders(<FamilyList />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders each family with its scientific name as title and name below', async () => {
    renderWithProviders(<FamilyList />);

    const links = await findFamilyLinks();

    expect(links).toHaveLength(2);
    links.forEach((link, index) => {
      const family = listFamilyItems[index];
      expect(link.querySelector('h3')).toHaveTextContent(family.scientificName);
      expect(link.querySelector('p')).toHaveTextContent(family.name);
    });
  });

  it('renders the scientific name title with the scientific name title style', async () => {
    renderWithProviders(<FamilyList />);

    const heading = await screen.findByRole('heading', {
      level: 3,
      name: firstFamily.scientificName
    });

    expect(within(heading).getByText(firstFamily.scientificName)).toHaveClass(
      'scientific-name',
      'scientific-name--title'
    );
  });

  it('creates links to family detail', async () => {
    renderWithProviders(<FamilyList />);

    const links = await findFamilyLinks();

    expect(links[0]).toHaveAttribute('href', `/families/${firstFamily.id}`);
    expect(links[1]).toHaveAttribute('href', `/families/${secondFamily.id}`);
  });

  it('renders the error response when the families request fails', async () => {
    mockedGetFamilyList.mockRejectedValue('network down');

    renderWithProviders(<FamilyList />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Error desconocido'
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders the empty state when there are no families', async () => {
    resolveFamilies([]);

    renderWithProviders(<FamilyList />);

    expect(
      await screen.findByText('No hay familias registradas.')
    ).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
