import type { Plant } from '../../../../types/Plant';

import BodySection from '../../../../shared/components/BodySection/BodySection';

import './plantEcology.css';

interface Props {
  readonly plant: Plant;
}

export default function PlantEcology({ plant }: Props) {
  const benefits = plant.knowledge.ecology.strategicBenefits;

  if (!benefits.length) {
    return null;
  }

  return (
    <BodySection title="Ecología">
      <ul className="plant-list plant-list--ecology">
        {benefits.map((benefit) => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ul>
    </BodySection>
  );
}
