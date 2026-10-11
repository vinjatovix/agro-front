import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { listPlantsResponse } from '../../../fixtures/plants/listPlants';
import PlantCard from '../../../../src/pages/plants/PlantCard/PlantCard';
import { capitalizeFirstLetter } from '../../../../src/shared/utils/capitalizeFirstLetter';
import type {
  Plant,
  PlantEcologicalTraits
} from '../../../../src/types/Plants/Plant';
import {
  buildPlantListItem,
  buildPlantListItemWithEcological
} from '../../../fixtures/plants/buildPlantListItem';

function toListItem({ id, identity, traits, image }: Plant) {
  return buildPlantListItem({ id, identity, traits, image });
}

describe('PlantCard', () => {
  const defaultPlant = toListItem(listPlantsResponse.data[0]);
  const otherPlant = toListItem(listPlantsResponse.data[1]);

  const renderComponent = (plant = defaultPlant) =>
    render(
      <MemoryRouter>
        <PlantCard plant={plant} />
      </MemoryRouter>
    );

  it('renders plant name capitalized', () => {
    renderComponent();

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Perejil'
    );
  });

  it.each([defaultPlant, otherPlant])(
    'renders the primary image of $identity.name.primary',
    (plant) => {
      renderComponent(plant);

      const image = screen.getByRole('img', {
        name: plant.identity.name.primary
      });

      expect(image).toHaveAttribute('src', plant.image.url);
    }
  );

  it('renders scientific name badge', () => {
    renderComponent();

    expect(
      screen.getByText(
        capitalizeFirstLetter(defaultPlant.identity.scientificName!)
      )
    ).toBeInTheDocument();
  });

  it('renders all aliases', () => {
    renderComponent();

    defaultPlant.identity.name.aliases.forEach((alias) => {
      expect(
        screen.getByText(capitalizeFirstLetter(alias))
      ).toBeInTheDocument();
    });
  });

  it('links to plant detail page', () => {
    renderComponent();

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      `/plants/${defaultPlant.id}`
    );
  });

  it('does not render scientific name when absent', () => {
    const plantWithoutScientific = {
      ...defaultPlant,
      identity: {
        ...defaultPlant.identity,
        scientificName: undefined
      }
    };

    render(
      <MemoryRouter>
        <PlantCard plant={plantWithoutScientific} />
      </MemoryRouter>
    );

    expect(
      screen.queryByText(
        capitalizeFirstLetter(defaultPlant.identity.scientificName!)
      )
    ).not.toBeInTheDocument();
  });

  it('does not render aliases container when aliases are empty', () => {
    const plantWithoutAliases = {
      ...defaultPlant,
      identity: {
        ...defaultPlant.identity,
        name: {
          ...defaultPlant.identity.name,
          aliases: []
        }
      }
    };

    render(
      <MemoryRouter>
        <PlantCard plant={plantWithoutAliases} />
      </MemoryRouter>
    );

    expect(document.querySelector('.plant-aliases')).not.toBeInTheDocument();
  });

  function safetyIndicators() {
    return screen
      .queryAllByRole('img')
      .map((img) => img.getAttribute('aria-label'))
      .filter((name) => name === 'Comestible' || name === 'Tóxica');
  }

  it.each<[PlantEcologicalTraits, string[]]>([
    [{ edible: true }, ['Comestible']],
    [{ toxic: true }, ['Tóxica']],
    [{ edible: true, toxic: true }, ['Comestible', 'Tóxica']],
    [{ edible: false, toxic: false }, []],
    [{}, []]
  ])('shows safety indicators for %j', (ecological, expected) => {
    renderComponent(buildPlantListItemWithEcological(ecological));

    expect(safetyIndicators()).toEqual(expected);
  });

  it('shows no safety indicators without ecological data', () => {
    renderComponent({
      ...defaultPlant,
      traits: { ...defaultPlant.traits, ecological: undefined }
    });

    expect(safetyIndicators()).toEqual([]);
  });

  it('marks a deleted plant in the card heading', () => {
    renderComponent(buildPlantListItem({ status: 'DELETED' }));

    const heading = document.querySelector('.plant-card__heading');

    expect(heading).toHaveTextContent('Borrada');
  });

  it.each(['ACTIVE', undefined] as const)(
    'does not mark a plant with status %s',
    (status) => {
      renderComponent(buildPlantListItem({ status }));

      expect(screen.queryByText('Borrada')).not.toBeInTheDocument();
    }
  );
});
