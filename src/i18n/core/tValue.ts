import { t } from './t';

type ValueGroup =
  | 'plant.calendar.seasonValues'
  | 'plant.filters.lifeCycleValues'
  | 'plant.filters.sowingMethodValues'
  | 'plant.filters.lightTypeValues'
  | 'plant.filters.rootSystemValues'
  | 'plant.cultivation.propagation.methodValues'
  | 'plant.cultivation.pruning.pruningTypeValues'
  | 'plant.cultivation.pruning.pruningIntensityValues';

export function tValue(group: ValueGroup, value: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return t(`${group}.${value}` as any);
}
