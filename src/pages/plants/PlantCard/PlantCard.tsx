import { Link } from 'react-router-dom';
import type { Plant } from '../../../types/Plants/Plant';
import { capitalizeFirstLetter } from '../../../shared/utils/capitalizeFirstLetter';
import { findPlantImage } from '../utils/findPlantImage';

import './plantCard.css';
import Badge from '../../../shared/components/Badge/Bagde';
import { iconsMap } from '../../../shared/constants/iconsMap';

export interface PlantCardProps {
  readonly plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const imageUrl = findPlantImage(plant);
  return (
    <Link to={`/plants/${plant.id}`}>
      <article className="plant-card">
        <h3> {capitalizeFirstLetter(plant.identity.name.primary)}</h3>
        {imageUrl && <img src={imageUrl} alt={plant.identity.name.primary} />}

        {plant.identity.scientificName && (
          <p className="plant-scientific-name">
            <Badge variant="scientific" icon={iconsMap.research}>
              {capitalizeFirstLetter(plant.identity.scientificName)}
            </Badge>
          </p>
        )}

        {plant.identity.name.aliases.length > 0 && (
          <div className="plant-aliases">
            {plant.identity.name.aliases.map((alias) => (
              <Badge key={alias} variant="alias" icon={iconsMap.tag}>
                {capitalizeFirstLetter(alias)}
              </Badge>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
