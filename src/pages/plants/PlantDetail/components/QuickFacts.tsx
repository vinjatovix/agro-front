import type { Plant } from '../../../../types/Plant';

import InfoRow from './InfoRow';
import BodySection from '../../../../shared/components/BodySection/BodySection';
import { t } from '../../../../i18n/core/t';

interface Props {
  readonly plant: Plant;
}

const LIFE_CYCLE_LABELS: Record<string, string> = {
  annual: 'Anual',
  biennial: 'Bienal',
  perennial: 'Perenne'
};

const LIGHT_TYPE_LABELS: Record<string, string> = {
  full_sun: 'Pleno sol',
  partial_shade: 'Sombra parcial',
  full_shade: 'Sombra total'
};

const WATERING_LABELS: Record<string, string> = {
  daily: 'Diario',
  weekly: 'Semanal',
  biweekly: 'Cada 2 semanas'
};

export default function QuickFacts({ plant }: Props) {
  return (
    <BodySection title={`⚡ ${t('plant.quick_facts.title')}`}>
      <InfoRow
        label={`♻️ ${t('plant.quick_facts.lifecycle')}`}
        value={
          LIFE_CYCLE_LABELS[plant.traits.lifecycle] ?? plant.traits.lifecycle
        }
      />

      <InfoRow
        label={`☀️ ${t('plant.quick_facts.light')}`}
        value={
          LIGHT_TYPE_LABELS[plant.knowledge.light.type] ??
          plant.knowledge.light.type
        }
      />

      <InfoRow
        label={`⏰ ${t('plant.quick_facts.light_hours')}`}
        value={`${plant.knowledge.light.hoursMin}+ ${t('plant.quick_facts.light_hours')} al día`}
      />

      <InfoRow
        label={`💧 ${t('plant.quick_facts.watering')}`}
        value={
          WATERING_LABELS[plant.knowledge.watering?.frequency] ??
          plant.knowledge.watering?.frequency
        }
      />

      <InfoRow
        label={`💧 ${t('plant.quick_facts.watering_conditions')}`}
        value={plant.knowledge.watering?.conditions?.join(', ')}
      />

      <InfoRow
        label={`⬆️ ${t('plant.quick_facts.height')}`}
        value={`${plant.traits.size.height.min}-${plant.traits.size.height.max} cm`}
      />

      <InfoRow
        label={`↔️ ${t('plant.quick_facts.spread')}`}
        value={`${plant.traits.size.spread.min}-${plant.traits.size.spread.max} cm`}
      />

      <InfoRow
        label={`📏 ${t('plant.quick_facts.spacing')}`}
        value={`${plant.traits.spacingCm.min}-${plant.traits.spacingCm.max} cm`}
      />
    </BodySection>
  );
}
