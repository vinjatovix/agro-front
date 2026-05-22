import { capitalizeFirstLetter } from '../../../../shared/utils/capitalizeFirstLetter';
import { iconsMap } from '../../../../shared/constants/iconsMap';
import Badge from '../../../../shared/components/Badge/Bagde';
import type { Plant } from '../../../../types/Plants/Plant';

import './plantDetailStickyHeader.css';

interface Props {
  readonly plant: Plant;
}

export const PlantDetailStickyHeader = ({ plant }: Props) => {
  return (
    <div className="plant-detail__sticky-header">
      <h1 className="plant-detail__sticky-title">
        {capitalizeFirstLetter(plant.identity.name.primary)}
      </h1>

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
