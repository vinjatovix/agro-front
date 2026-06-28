import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { listPlantsResponse } from '../../../fixtures/plants/listPlants';
import PlantCard from '../../../../src/pages/plants/PlantCard/PlantCard';
import { capitalizeFirstLetter } from '../../../../src/shared/utils/capitalizeFirstLetter';

describe('PlantCard', () => {
  const plantWithNoImage = listPlantsResponse.data[0];
  const plantWithImage = listPlantsResponse.data[1];

  const renderComponent = (plant = plantWithNoImage) =>
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

  it('renders image when available', () => {
    renderComponent(plantWithImage);

    const image = screen.getByRole('img');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      plantWithImage.knowledge.resources![0].url
    );
    expect(image).toHaveAttribute('alt', plantWithImage.identity.name.primary);
  });

  it('does not render image when unavailable', () => {
    renderComponent(plantWithNoImage);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders scientific name badge', () => {
    renderComponent();

    expect(
      screen.getByText(
        capitalizeFirstLetter(plantWithNoImage.identity.scientificName!)
      )
    ).toBeInTheDocument();
  });

  it('renders all aliases', () => {
    renderComponent();

    plantWithNoImage.identity.name.aliases.forEach((alias) => {
      expect(
        screen.getByText(capitalizeFirstLetter(alias))
      ).toBeInTheDocument();
    });
  });

  it('links to plant detail page', () => {
    renderComponent();

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      `/plants/${plantWithNoImage.id}`
    );
  });

  it('does not render scientific name when absent', () => {
    const plantWithoutScientific = {
      ...plantWithNoImage,
      identity: {
        ...plantWithNoImage.identity,
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
        capitalizeFirstLetter(plantWithNoImage.identity.scientificName!)
      )
    ).not.toBeInTheDocument();
  });

  it('does not render aliases container when aliases are empty', () => {
    const plantWithoutAliases = {
      ...plantWithNoImage,
      identity: {
        ...plantWithNoImage.identity,
        name: {
          ...plantWithNoImage.identity.name,
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
});
