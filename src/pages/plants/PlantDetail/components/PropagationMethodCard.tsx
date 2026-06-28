import { t } from '../../../../i18n/core/t';
import { tValue } from '../../../../i18n/core/tValue';
import { iconsMap } from '../../../../shared/constants/iconsMap';

import InfoRow from './InfoRow';

interface Props {
  readonly method: string;
  readonly season: string;
  readonly bestPractices?: string[];
}

export default function PropagationMethodCard({
  method,
  season,
  bestPractices
}: Props) {
  return (
    <div className="propagation-card" data-testid={`propagation-${method}`}>
      <InfoRow
        label={`${iconsMap.testTube} ${t('plant.cultivation.propagation.method')}`}
        value={tValue('plant.cultivation.propagation.methodValues', method)}
      />

      <InfoRow
        label={`${iconsMap.calendar} ${t('plant.calendar.season')}`}
        value={tValue('plant.calendar.seasonValues', season)}
      />

      {bestPractices && bestPractices.length > 0 && (
        <InfoRow
          label={`${iconsMap.pin} ${t('plant.cultivation.propagation.best_practices')}`}
          value={
            <ul className="propagation-card__list">
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
