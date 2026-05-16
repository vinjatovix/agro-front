import { t } from '../../../../i18n/core/t';
import InfoRow from './InfoRow';
import { tValue } from '../../../../i18n/core/tValue';

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
        label={`🧩 ${t('plant.cultivation.pruning.type')}`}
        value={tValue('plant.cultivation.pruning.pruningTypeValues', type)}
      />

      <InfoRow
        label={`⚡ ${t('plant.cultivation.pruning.intensity')}`}
        value={tValue(
          'plant.cultivation.pruning.pruningIntensityValues',
          intensity
        )}
      />

      <InfoRow
        label={`📅 ${t('plant.calendar.season')}`}
        value={tValue('plant.calendar.seasonValues', season)}
      />

      <InfoRow
        label={`🔁 ${t('plant.cultivation.pruning.frequency')}`}
        value={`${frequencyPerYear} ${t('plant.cultivation.pruning.times_per_year')}`}
      />

      {bestPractices && bestPractices.length > 0 && (
        <InfoRow
          label={`📌 ${t('plant.cultivation.pruning.best_practices')}`}
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
