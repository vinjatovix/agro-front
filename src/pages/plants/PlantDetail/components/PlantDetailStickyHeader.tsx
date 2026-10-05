import { capitalizeFirstLetter } from '../../../../shared/utils/capitalizeFirstLetter';
import { iconsMap } from '../../../../shared/constants/iconsMap';
import Badge from '../../../../shared/components/Badge/Badge';
import type { Plant } from '../../../../types/Plants/Plant';
import PlantSafetyIndicators from '../../components/PlantSafetyIndicators/PlantSafetyIndicators';
import { readPlantSafety } from '../../utils/plantSafety';

import './plantDetailStickyHeader.css';

interface Props {
  readonly plant: Plant;
}

export const PlantDetailStickyHeader = ({ plant }: Props) => {
  return (
    <div className="plant-detail__sticky-header">
      <div className="plant-detail__sticky-heading">
        <h1 className="plant-detail__sticky-title">
          {capitalizeFirstLetter(plant.identity.name.primary)}
        </h1>
        <PlantSafetyIndicators safety={readPlantSafety(plant)} />
      </div>

      {plant.identity.name.aliases.length > 0 && (
        <div className="plant-detail__sticky-aliases">
          {plant.identity.name.aliases.map((alias) => (
            <Badge key={alias} variant="alias" icon={iconsMap.tag}>
              {capitalizeFirstLetter(alias)}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
