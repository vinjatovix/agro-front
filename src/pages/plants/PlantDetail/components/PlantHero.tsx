import { t } from '../../../../i18n/core/t';
import Badge from '../../../../shared/components/Badge/Bagde';
import { capitalizeFirstLetter } from '../../../../shared/utils/capitalizeFirstLetter';
import type { Plant } from '../../../../types/Plant';
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

      <Badge variant="family" icon="🌿">
        {plant.identity.family}
      </Badge>
      {plant.identity.scientificName && (
        <p className="plant-hero__scientific">
          <strong>🧬 {t('plant.hero.scientific_name')}: </strong>
          {capitalizeFirstLetter(plant.identity.scientificName)}
        </p>
      )}
    </header>
  );
}
