import type { Plant } from '../../../../types/Plant';

import PlantSection from './PlantSection';
import InfoRow from './InfoRow';
import PropagationMethodCard from './PropagationMethodCard';
import PruningCard from './PruningCard';

import './plantCultivation.css';

interface Props {
  plant: Plant;
}

export default function PlantCultivation({ plant }: Props) {
  const propagationMethods = plant.knowledge.propagation?.methods ?? {};

  return (
    <PlantSection title="Cultivo">
      {/* SOIL / ROOT BASIC FACTS */}
      <div className="cultivation-basic">
        <InfoRow
          label="⚗️ pH del suelo"
          value={`${plant.knowledge.soil.ph.min}-${plant.knowledge.soil.ph.max}`}
        />

        <InfoRow
          label="🪴 Profundidad del suelo"
          value={`${plant.knowledge.soil.availableDepthCm.min}-${plant.knowledge.soil.availableDepthCm.max} cm`}
        />

        <InfoRow
          label="🫚 Sistema radicular"
          value={plant.knowledge.rootSystem.type}
        />

        <InfoRow
          label="📏 Profundidad de la raíz"
          value={`${plant.knowledge.rootSystem.depthCm.min}-${plant.knowledge.rootSystem.depthCm.max} cm`}
        />
      </div>

      {/* PROPAGATION SECTION */}
      <div className="cultivation-section">
        <h3 className="cultivation-section__title">🌱 Propagación</h3>

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

      {/* PRUNING SECTION */}
      {plant.knowledge.pruning && plant.knowledge.pruning.length > 0 && (
        <div className="cultivation-section">
          <h3 className="cultivation-section__title">✂️ Poda</h3>

          <div className="pruning-grid">
            {plant.knowledge.pruning.map((p, index) => (
              <PruningCard
                key={index}
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
    </PlantSection>
  );
}
