import type { Plant } from '../../../../types/Plant';

import BodySection from '../../../../shared/components/BodySection/BodySection';
import InfoRow from './InfoRow';
import PropagationMethodCard from './PropagationMethodCard';
import PruningCard from './PruningCard';

import './plantCultivation.css';
import { t } from '../../../../i18n/core/t';

const ROOT_SYSTEMS_LABELS: Record<string, string> = {
  fibrous: 'Fibroso',
  taproot: 'Pivotante',
  adventitious: 'Adventicio',
  tuberous: 'Tubérculo',
  rhizome: 'Rizoma'
};

interface Props {
  readonly plant: Plant;
}

export default function PlantCultivation({ plant }: Props) {
  const propagationMethods = plant.knowledge.propagation?.methods ?? {};

  return (
    <BodySection title={`🌱 ${t('plant.cultivation.title')}`}>
      <div className="cultivation-basic">
        <InfoRow
          label={`⚗️ ${t('plant.cultivation.soil_ph')}`}
          value={`${plant.knowledge.soil.ph.min}-${plant.knowledge.soil.ph.max}`}
        />

        <InfoRow
          label={`🪴 ${t('plant.cultivation.soil_depth')}`}
          value={`${plant.knowledge.soil.availableDepthCm.min}-${plant.knowledge.soil.availableDepthCm.max} cm`}
        />

        <InfoRow
          label={`🫚 ${t('plant.cultivation.root_system')}`}
          value={
            ROOT_SYSTEMS_LABELS[plant.knowledge.rootSystem.type] ??
            plant.knowledge.rootSystem.type
          }
        />

        <InfoRow
          label={`📏 ${t('plant.cultivation.root_depth')}`}
          value={`${plant.knowledge.rootSystem.depthCm.min}-${plant.knowledge.rootSystem.depthCm.max} cm`}
        />
      </div>

      <div className="cultivation-section">
        <h3 className="cultivation-section__title">
          🌱 {t('plant.cultivation.propagation')}
        </h3>

        <div className="propagation-grid">
          {Object.entries(propagationMethods).map(([method, data]) => (
            <PropagationMethodCard
              key={method}
              method={method}
              season={data.season ?? ''}
              bestPractices={data.bestPractices}
            />
          ))}
        </div>
      </div>

      {plant.knowledge.pruning && plant.knowledge.pruning.length > 0 && (
        <div className="cultivation-section">
          <h3 className="cultivation-section__title">
            ✂️ {t('plant.cultivation.pruning')}
          </h3>

          <div className="pruning-grid">
            {plant.knowledge.pruning.map((p) => (
              <PruningCard
                key={`${p.type}-${p.season}`}
                type={p.type}
                intensity={p.intensity}
                season={p.season}
                frequencyPerYear={p.frequencyPerYear}
                bestPractices={p.bestPractices}
              />
            ))}
          </div>
        </div>
      )}
    </BodySection>
  );
}
