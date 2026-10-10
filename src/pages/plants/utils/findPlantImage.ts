import type { Plant } from '../../../types/Plants/Plant';

export const findPlantImage = (
  plant: Pick<Plant, 'knowledge'>
): string | null => {
  const imageResource = plant.knowledge.resources?.find(
    (res) => res.type === 'image'
  );
  return imageResource ? imageResource.url : null;
};
