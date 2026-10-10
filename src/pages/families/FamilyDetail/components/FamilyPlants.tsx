import { Link } from 'react-router-dom';
import PlantStatusBadge from '../../../../components/plants/PlantStatusBadge/PlantStatusBadge';
import { t } from '../../../../i18n/core/t';
import BodySection from '../../../../shared/components/BodySection/BodySection';
import { iconsMap } from '../../../../shared/constants/iconsMap';
import { capitalizeFirstLetter } from '../../../../shared/utils/capitalizeFirstLetter';
import type { Family } from '../../../../types/Family';
import type { FamilyPlantItem } from '../../../../types/Plants/Plant';

interface Props {
  readonly family: Family;
  readonly plants: FamilyPlantItem[];
  readonly total?: number;
}

function getCountLabel(count: number, total: number): string {
  const safeTotal = Math.max(total, count);
  if (safeTotal > count) {
    return t('family.plants.showing_count', { count, total: safeTotal });
  }
  if (safeTotal > 1) {
    return t('family.plants.total_count', { total: safeTotal });
  }
  return t('family.plants.single_count');
}

export default function FamilyPlants({ family, plants, total }: Props) {
  const effectiveTotal = Math.max(total ?? plants.length, plants.length);

  return (
    <BodySection title={`${iconsMap.gardening} ${t('family.plants.title')}`}>
      {effectiveTotal === 0 ? (
        <p className="family-plants__empty" data-testid="family-plants-empty">
          {t('family.plants.empty')}
        </p>
      ) : (
        <>
          <p className="family-plants__count" data-testid="family-plants-count">
            {getCountLabel(plants.length, effectiveTotal)}
          </p>

          <Link
            to={`/plants?family=${family.id}`}
            className="family-detail__cta-link"
            data-testid="family-plants-view-all"
          >
            {iconsMap.arrowRight} {t('family.plants.view_all')}
          </Link>

          <div className="family-plants__grid">
            {plants.map((plant) => (
              <Link
                key={plant.id}
                to={`/plants/${plant.id}`}
                className="family-plants__grid-item"
                data-testid="family-plants-link"
              >
                {capitalizeFirstLetter(plant.identity.name.primary)}
                <PlantStatusBadge status={plant.status} />
              </Link>
            ))}
          </div>
        </>
      )}
    </BodySection>
  );
}
