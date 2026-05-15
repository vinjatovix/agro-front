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
      <h1>{capitalizeFirstLetter(plant.identity.name.primary)}</h1>
      {imageUrl && (
        <img
          className="plant-hero__image"
          src={imageUrl}
          alt={plant.identity.name.primary}
        />
      )}
      <div className="plant-hero__meta">
        <Badge variant="family" icon="🌿">
          {plant.identity.family}
        </Badge>
        {plant.identity.scientificName && (
          <p className="plant-hero__scientific">
            🧬 Nombre científico:{' '}
            {capitalizeFirstLetter(plant.identity.scientificName)}
          </p>
        )}

        {plant.identity.name.aliases.length > 0 && (
          <div className="plant-hero__aliases">
            <span className="plant-hero__label">Aliases:</span>

            <span className="plant-hero__aliases-list">
              {plant.identity.name.aliases.map((alias) => (
                <Badge key={alias} variant="alias" icon="🏷️">
                  {capitalizeFirstLetter(alias)}
                </Badge>
              ))}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
