import { t } from '../../../../i18n/core/t';
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
      <InfoRow label={`🧩 ${t('plant.pruning.type')}`} value={type} />

      <InfoRow label={`⚡ ${t('plant.pruning.intensity')}`} value={intensity} />

      <InfoRow label={`📅 ${t('plant.pruning.season')}`} value={season} />

      <InfoRow
        label={`🔁 ${t('plant.pruning.frequency')}`}
        value={`${frequencyPerYear} ${t('plant.pruning.times_per_year')}`}
      />

      {bestPractices && bestPractices.length > 0 && (
        <InfoRow
          label={`📌 ${t('plant.pruning.best_practices')}`}
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
