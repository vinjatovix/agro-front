import { t } from '../../../../i18n/core/t';
import { iconsMap } from '../../../../shared/constants/iconsMap';
import type { PlantSafety } from '../../utils/plantSafety';

import './plantSafetyIndicators.css';

interface Props {
  readonly safety: PlantSafety;
}

const INDICATORS = [
  { flag: 'edible', icon: iconsMap.edible, labelKey: 'plant.safety.edible' },
  { flag: 'toxic', icon: iconsMap.toxic, labelKey: 'plant.safety.toxic' }
] as const;

export default function PlantSafetyIndicators({ safety }: Props) {
  const visible = INDICATORS.filter(({ flag }) => safety[flag] === 'yes');

  if (visible.length === 0) {
    return null;
  }

  return (
    <span className="plant-safety-indicators">
      {visible.map(({ flag, icon, labelKey }) => (
        <span
          key={flag}
          role="img"
          aria-label={t(labelKey)}
          title={t(labelKey)}
          className="plant-safety-indicators__item"
        >
          <span aria-hidden="true">{icon}</span>
        </span>
      ))}
    </span>
  );
}
