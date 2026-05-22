import { t } from '../../../../i18n/core/t';
import { tValue } from '../../../../i18n/core/tValue';
import { iconsMap } from '../../../../shared/constants/iconsMap';

import InfoRow from './InfoRow';

interface Props {
  readonly type: string;
  readonly intensity: string;
  readonly season: string;
  readonly frequencyPerYear: number;
  readonly bestPractices?: string[];
}

export default function PruningCard({
  type,
  intensity,
  season,
  frequencyPerYear,
  bestPractices
}: Props) {
  return (
    <div className="pruning-card" data-testid={`pruning-${type}`}>
      <InfoRow
        label={`${iconsMap.puzzle} ${t('plant.cultivation.pruning.type')}`}
        value={tValue('plant.cultivation.pruning.pruningTypeValues', type)}
      />

      <InfoRow
        label={`${iconsMap.lightning} ${t('plant.cultivation.pruning.intensity')}`}
        value={tValue(
          'plant.cultivation.pruning.pruningIntensityValues',
          intensity
        )}
      />

      <InfoRow
        label={`${iconsMap.calendar} ${t('plant.calendar.season')}`}
        value={tValue('plant.calendar.seasonValues', season)}
      />

      <InfoRow
        label={`${iconsMap.repeat} ${t('plant.cultivation.pruning.frequency')}`}
        value={`${frequencyPerYear} ${t('plant.cultivation.pruning.times_per_year')}`}
      />

      {bestPractices && bestPractices.length > 0 && (
        <InfoRow
          label={`${iconsMap.pin} ${t('plant.cultivation.pruning.best_practices')}`}
          value={
            <ul className="pruning-card__list">
              {bestPractices.map((bp) => (
                <li key={bp}>{bp}</li>
              ))}
            </ul>
          }
        />
      )}
    </div>
  );
}
