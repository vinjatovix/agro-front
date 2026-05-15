import type { Plant } from '../../../../types/Plant';

import PlantSection from './PlantSection';

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
    <PlantSection title="Ecología">
      <ul className="plant-list plant-list--ecology">
        {benefits.map((benefit) => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ul>
    </PlantSection>
  );
}
