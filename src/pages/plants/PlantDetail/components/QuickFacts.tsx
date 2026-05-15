import type { Plant } from '../../../../types/Plant';

import InfoRow from './InfoRow';
import PlantSection from './PlantSection';

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
    <PlantSection title="Datos rápidos">
      <InfoRow
        label="♻️ Ciclo de vida"
        value={
          LIFE_CYCLE_LABELS[plant.traits.lifecycle] ?? plant.traits.lifecycle
        }
      />

      <InfoRow
        label="☀️ Luz"
        value={
          LIGHT_TYPE_LABELS[plant.knowledge.light.type] ??
          plant.knowledge.light.type
        }
      />

      <InfoRow
        label="⏰ Horas de luz"
        value={`${plant.knowledge.light.hoursMin}+ horas al día`}
      />

      <InfoRow
        label="💧 Riego"
        value={
          WATERING_LABELS[plant.knowledge.watering?.frequency] ??
          plant.knowledge.watering?.frequency
        }
      />

      <InfoRow
        label="💧 Condiciones de riego"
        value={plant.knowledge.watering?.conditions?.join(', ')}
      />

      <InfoRow
        label="⬆️ Altura"
        value={`${plant.traits.size.height.min}-${plant.traits.size.height.max} cm`}
      />

      <InfoRow
        label="↔️ Ancho"
        value={`${plant.traits.size.spread.min}-${plant.traits.size.spread.max} cm`}
      />

      <InfoRow
        label="📏 Espaciado"
        value={`${plant.traits.spacingCm.min}-${plant.traits.spacingCm.max} cm`}
      />
    </PlantSection>
  );
}
