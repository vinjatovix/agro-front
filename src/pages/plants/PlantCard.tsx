import { Link } from 'react-router-dom';
import type { Plant } from '../../types/Plant';
import { capitalizeFirstLetter } from '../../shared/utils/capitalizeFirstLetter';
import { findPlantImage } from './utils/findPlantImage';

export interface PlantCardProps {
  readonly plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const imageUrl = findPlantImage(plant);
  return (
    <Link to={`/plants/${plant.id}`}>
      <article className="plant-card">
        <h3>{capitalizeFirstLetter(plant.identity.name.primary)}</h3>
        {imageUrl && <img src={imageUrl} alt={plant.identity.name.primary} />}

        {plant.identity.scientificName && (
          <p className="plant-scientific-name">
            {capitalizeFirstLetter(plant.identity.scientificName)}
          </p>
        )}
      </article>
    </Link>
  );
}
