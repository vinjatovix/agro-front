import { Link } from 'react-router-dom';
import { t } from '../../../../i18n/core/t';
import Badge from '../../../../shared/components/Badge/Bagde';
import { iconsMap } from '../../../../shared/constants/iconsMap';
import { capitalizeFirstLetter } from '../../../../shared/utils/capitalizeFirstLetter';
import type { Plant } from '../../../../types/Plants/Plant';

import { findPlantImage } from '../../utils/findPlantImage';

import './plantHero.css';

interface Props {
  readonly plant: Plant;
}

export default function PlantHero({ plant }: Props) {
  const imageUrl = findPlantImage(plant);

  return (
    <header className="plant-hero">
      {imageUrl && (
        <img
          className="plant-hero__image"
          src={imageUrl}
          alt={plant.identity.name.primary}
        />
      )}

      <Link
        to={`/families/${plant.identity.family}`}
        className="plant-hero__family-link"
      >
        <Badge variant="family" icon={iconsMap.genome}>
          {plant.identity.family}
        </Badge>
      </Link>

      {plant.identity.scientificName && (
        <p className="plant-hero__scientific">
          <strong>
            {iconsMap.research} {t('plant.hero.scientific_name')}:{' '}
          </strong>
          {capitalizeFirstLetter(plant.identity.scientificName)}
        </p>
      )}
    </header>
  );
}
