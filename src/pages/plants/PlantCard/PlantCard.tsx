import { Link } from 'react-router-dom';
import type { PlantListItem } from '../../../types/Plants/Plant';
import PlantStatusBadge from '../../../components/plants/PlantStatusBadge/PlantStatusBadge';
import { capitalizeFirstLetter } from '../../../shared/utils/capitalizeFirstLetter';
import { readPlantSafety } from '../utils/plantSafety';
import PlantSafetyIndicators from '../components/PlantSafetyIndicators/PlantSafetyIndicators';

import './plantCard.css';
import Badge from '../../../shared/components/Badge/Badge';
import ScientificName from '../../../shared/components/ScientificName/ScientificName';
import { iconsMap } from '../../../shared/constants/iconsMap';

export interface PlantCardProps {
  readonly plant: PlantListItem;
}

export default function PlantCard({ plant }: PlantCardProps) {
  return (
    <Link to={`/plants/${plant.id}`}>
      <article className="plant-card">
        <div className="plant-card__heading">
          <h3> {capitalizeFirstLetter(plant.identity.name.primary)}</h3>
          <PlantSafetyIndicators safety={readPlantSafety(plant)} />
          <PlantStatusBadge status={plant.status} />
        </div>
        <img src={plant.image.url} alt={plant.identity.name.primary} />

        {plant.identity.scientificName && (
          <p className="plant-scientific-name">
            <Badge variant="scientific" icon={iconsMap.research}>
              <ScientificName>
                {capitalizeFirstLetter(plant.identity.scientificName)}
              </ScientificName>
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
