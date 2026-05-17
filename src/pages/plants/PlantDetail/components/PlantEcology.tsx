import type { Plant } from '../../../../types/Plants/Plant';

import BodySection from '../../../../shared/components/BodySection/BodySection';

import './plantEcology.css';
import { t } from '../../../../i18n/core/t';

interface Props {
  readonly plant: Plant;
}

export default function PlantEcology({ plant }: Props) {
  const benefits = plant.knowledge.ecology.strategicBenefits;

  if (!benefits.length) {
    return null;
  }

  return (
    <BodySection title={`🌿 ${t('plant.ecology.title')}`}>
      <ul className="plant-list plant-list--ecology">
        {benefits.map((benefit) => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ul>
    </BodySection>
  );
}
