import { Link } from 'react-router-dom';
import { t } from '../../../../i18n/core/t';
import BodySection from '../../../../shared/components/BodySection/BodySection';
import { iconsMap } from '../../../../shared/constants/iconsMap';
import { capitalizeFirstLetter } from '../../../../shared/utils/capitalizeFirstLetter';
import type { Family } from '../../../../types/Family';
import type { Plant } from '../../../../types/Plants/Plant';

interface Props {
  readonly family: Family;
  readonly plants: Plant[];
}

export default function FamilyPlants({ family, plants }: Props) {
  return (
    <BodySection title={`${iconsMap.gardening} ${t('family.plants.title')}`}>
      <Link
        to={`/plants?family=${family.id}`}
        className="family-detail__cta-link"
      >
        {iconsMap.arrowRight} {t('family.plants.view_all')}
      </Link>

      <div className="plant-grid">
        {plants.map((plant) => (
          <Link
            key={plant.id}
            to={`/plants/${plant.id}`}
            className="plant-grid__item"
            data-testid="family-plants-link"
          >
            {capitalizeFirstLetter(plant.identity.name.primary)}
          </Link>
        ))}
      </div>
    </BodySection>
  );
}
