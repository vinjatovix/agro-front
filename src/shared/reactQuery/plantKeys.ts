import type { PlantListRequest } from '../../services/plantListQuery';

export const plantKeys = {
  all: ['plants'] as const,
  list: (request: PlantListRequest) =>
    [...plantKeys.all, 'list', request] as const
};
