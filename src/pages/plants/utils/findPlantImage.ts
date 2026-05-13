import type { Plant } from '../../../types/Plant';

export const findPlantImage = (plant: Plant): string | null => {
  const imageResource = plant.knowledge.resources?.find(
    (res) => res.type === 'image'
  );
  return imageResource ? imageResource.url : null;
};
