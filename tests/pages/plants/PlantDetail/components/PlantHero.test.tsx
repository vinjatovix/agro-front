import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import PlantHero from '../../../../../src/pages/plants/PlantDetail/components/PlantHero';
import { buildFamilySummary } from '../../../../fixtures/families/buildFamilySummary';
import { buildPlantWithFamily } from '../../../../fixtures/plants/buildPlant';

describe('PlantHero: linked family', () => {
  it('renders family name as a link pointing to the family slug', () => {
    const family = buildFamilySummary({
      id: '5a2380c4-1546-4511-a77b-ec9d3ebcb7cf',
      name: 'Solanáceas',
      slug: 'solanaceae'
    });
    const plant = buildPlantWithFamily(family);

    render(
      <MemoryRouter>
        <PlantHero plant={plant} />
      </MemoryRouter>
    );

    const familyLink = screen.getByRole('link', { name: 'Solanáceas' });
    expect(familyLink).toHaveAttribute('href', '/families/solanaceae');
  });

  it('does not expose the raw family id in the link or text', () => {
    const familyId = '5a2380c4-1546-4511-a77b-ec9d3ebcb7cf';
    const family = buildFamilySummary({
      id: familyId,
      name: 'Solanáceas',
      slug: 'solanaceae'
    });
    const plant = buildPlantWithFamily(family);

    render(
      <MemoryRouter>
        <PlantHero plant={plant} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Solanáceas' });
    expect(link).not.toHaveAttribute('href', expect.stringContaining(familyId));
    expect(
      screen.queryByText(new RegExp(familyId, 'i'))
    ).not.toBeInTheDocument();
  });
});

describe('PlantHero: unavailable and missing family', () => {
  it('renders unavailable badge text when family is a string identifier', () => {
    const plant = buildPlantWithFamily('5a2380c4-1546-4511-a77b-ec9d3ebcb7cf');

    render(
      <MemoryRouter>
        <PlantHero plant={plant} />
      </MemoryRouter>
    );

    expect(screen.getByText('Familia no disponible')).toBeInTheDocument();
  });

  it('does not render a link when family is unavailable', () => {
    const plant = buildPlantWithFamily('5a2380c4-1546-4511-a77b-ec9d3ebcb7cf');

    render(
      <MemoryRouter>
        <PlantHero plant={plant} />
      </MemoryRouter>
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('does not render a button when family is unavailable', () => {
    const plant = buildPlantWithFamily('5a2380c4-1546-4511-a77b-ec9d3ebcb7cf');

    render(
      <MemoryRouter>
        <PlantHero plant={plant} />
      </MemoryRouter>
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not expose the raw family id in the DOM when family is unavailable', () => {
    const familyId = '5a2380c4-1546-4511-a77b-ec9d3ebcb7cf';
    const plant = buildPlantWithFamily(familyId);

    render(
      <MemoryRouter>
        <PlantHero plant={plant} />
      </MemoryRouter>
    );

    expect(
      screen.queryByText(new RegExp(familyId, 'i'))
    ).not.toBeInTheDocument();
  });

  it('renders no family badge when family is missing', () => {
    const basePlant = buildPlantWithFamily(
      '5a2380c4-1546-4511-a77b-ec9d3ebcb7cf'
    );
    const plant = {
      ...basePlant,
      identity: {
        ...basePlant.identity,
        family: undefined as unknown as string
      }
    };

    render(
      <MemoryRouter>
        <PlantHero plant={plant} />
      </MemoryRouter>
    );

    expect(screen.queryByText('Familia no disponible')).not.toBeInTheDocument();
  });
});
