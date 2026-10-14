import { t } from '../../../../i18n/core/t';
import { tValue } from '../../../../i18n/core/tValue';
import { iconsMap } from '../../../../shared/constants/iconsMap';
import type { Plant } from '../../../../types/Plants/Plant';
import BodySection from '../../../../shared/components/BodySection/BodySection';

import InfoRow from './InfoRow';
interface Props {
  readonly plant: Plant;
}

export default function QuickFacts({ plant }: Props) {
  return (
    <BodySection
      title={`${iconsMap.lightning} ${t('plant.quick_facts.title')}`}
    >
      <InfoRow
        label={`${iconsMap.recycle} ${t('plant.quick_facts.lifecycle')}`}
        value={tValue('plant.filters.lifeCycleValues', plant.traits.lifecycle)}
      />

      <InfoRow
        label={`${iconsMap.sun} ${t('plant.quick_facts.light')}`}
        value={tValue(
          'plant.filters.lightTypeValues',
          plant.knowledge.light.type
        )}
      />

      <InfoRow
        label={`${iconsMap.clock} ${t('plant.quick_facts.light_hours')}`}
        value={t('plant.quick_facts.light_hours_value', {
          hours: plant.knowledge.light.hoursMin
        })}
      />

      <InfoRow
        label={`${iconsMap.water} ${t('plant.quick_facts.watering')}`}
        value={plant.knowledge.watering?.frequency}
      />

      <InfoRow
        label={`${iconsMap.conditions} ${t('plant.quick_facts.watering_conditions')}`}
        value={plant.knowledge.watering?.conditions?.join(', ')}
      />

      <InfoRow
        label={`${iconsMap.arrowUp} ${t('plant.quick_facts.height')}`}
        value={`${plant.traits.size.height.min}-${plant.traits.size.height.max} cm`}
      />

      <InfoRow
        label={`${iconsMap.spread} ${t('plant.quick_facts.spread')}`}
        value={`${plant.traits.size.spread.min}-${plant.traits.size.spread.max} cm`}
      />

      <InfoRow
        label={`${iconsMap.ruler} ${t('plant.quick_facts.spacing')}`}
        value={`${plant.traits.spacingCm.min}-${plant.traits.spacingCm.max} cm`}
      />
    </BodySection>
  );
}
