import { Link } from 'react-router-dom';

import { t } from '../../../../i18n/core/t';
import Badge from '../../../../shared/components/Badge/Badge';
import Icon from '../../../../shared/components/Icon/Icon';
import ScientificName from '../../../../shared/components/ScientificName/ScientificName';
import { capitalizeFirstLetter } from '../../../../shared/utils/capitalizeFirstLetter';
import type { Plant } from '../../../../types/Plants/Plant';
import { readPlantFamily } from '../../utils/plantFamily';

import './plantHero.css';

interface Props {
  readonly plant: Plant;
}

export default function PlantHero({ plant }: Props) {
  const familyView = readPlantFamily(plant.identity?.family);

  return (
    <header className="plant-hero">
      <img
        className="plant-hero__image"
        src={plant.image.url}
        alt={plant.identity.name.primary}
      />

      {familyView?.kind === 'linked' && (
        <Link
          to={`/families/${encodeURIComponent(familyView.slug)}`}
          className="plant-hero__family-link"
        >
          <Badge variant="family" icon="biotech">
            {familyView.name}
          </Badge>
        </Link>
      )}

      {familyView?.kind === 'unavailable' && (
        <Badge variant="unavailable" icon="biotech">
          {t('plant.hero.family_unavailable')}
        </Badge>
      )}

      {plant.identity.scientificName && (
        <p className="plant-hero__scientific">
          <strong>
            <Icon name="microscope" decorative />{' '}
            {t('plant.hero.scientific_name')}:{' '}
          </strong>
          <ScientificName>
            {capitalizeFirstLetter(plant.identity.scientificName)}
          </ScientificName>
        </p>
      )}
    </header>
  );
}
