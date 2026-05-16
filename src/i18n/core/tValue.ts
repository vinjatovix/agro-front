import { t } from './t';

type ValueGroup =
  | 'plant.filters.lifeCycleValues'
  | 'plant.filters.sowingMethodValues'
  | 'plant.filters.lightTypeValues'
  | 'plant.filters.rootSystemValues';

export function tValue(group: ValueGroup, value: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return t(`${group}.${value}` as any);
}
