import { t } from '../../../../i18n/core/t';
import { tValue } from '../../../../i18n/core/tValue';
import BodySection from '../../../../shared/components/BodySection/BodySection';
import { iconsMap } from '../../../../shared/constants/iconsMap';
import type { Plant } from '../../../../types/Plants/Plant';

import InfoRow from './InfoRow';
import PropagationMethodCard from './PropagationMethodCard';
import PruningCard from './PruningCard';

import './plantCultivation.css';

interface Props {
  readonly plant: Plant;
}

export default function PlantCultivation({ plant }: Props) {
  const propagationMethods = plant.knowledge.propagation?.methods ?? {};

  return (
    <BodySection title={`${iconsMap.sowing} ${t('plant.cultivation.title')}`}>
      <div className="cultivation-basic">
        <InfoRow
          label={`${iconsMap.chemistry} ${t('plant.cultivation.soil_ph')}`}
          value={`${plant.knowledge.soil.ph.min}-${plant.knowledge.soil.ph.max}`}
        />

        <InfoRow
          label={`${iconsMap.soilDepth} ${t('plant.cultivation.soil_depth')}`}
          value={`${plant.knowledge.soil.availableDepthCm.min}-${plant.knowledge.soil.availableDepthCm.max} cm`}
        />

        <InfoRow
          label={`${iconsMap.rootSystem} ${t('plant.cultivation.root_system')}`}
          value={tValue(
            'plant.filters.rootSystemValues',
            plant.knowledge.rootSystem.type
          )}
        />

        <InfoRow
          label={`${iconsMap.ruler} ${t('plant.cultivation.root_depth')}`}
          value={`${plant.knowledge.rootSystem.depthCm.min}-${plant.knowledge.rootSystem.depthCm.max} cm`}
        />
      </div>

      <div className="cultivation-section">
        <h3 className="cultivation-section__title">
          {iconsMap.sowing} {t('plant.cultivation.propagation.propagation')}
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
            {iconsMap.scissors} {t('plant.cultivation.pruning.pruning')}
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
