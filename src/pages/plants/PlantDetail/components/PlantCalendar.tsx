import type { Plant } from '../../../../types/Plant';

import CalendarRow from './CalendarRow';
import HemisphereToggle from './HemisphereToggle';
import InfoRow from './InfoRow';
import MonthChips from './MonthChips';
import BodySection from '../../../../shared/components/BodySection/BodySection';

import './plantCalendar.css';

interface Props {
  readonly plant: Plant;
  readonly hemisphere: 'north' | 'south';
  readonly onHemisphereChange?: (value: 'north' | 'south') => void;
}

export default function PlantCalendar({
  plant,
  hemisphere,
  onHemisphereChange
}: Props) {
  return (
    <BodySection title="Calendario">
      <div className="plant-calendar__controls">
        {onHemisphereChange && (
          <HemisphereToggle value={hemisphere} onChange={onHemisphereChange} />
        )}
      </div>
      <div className="plant-calendar__grid">
        <InfoRow
          label="🫘 Semillas por golpe"
          value={`${plant.phenology.sowing.seedsPerHole.min}-${plant.phenology.sowing.seedsPerHole.max}`}
        />

        <InfoRow
          label="⏳ Germinación"
          value={`${plant.phenology.sowing.germinationDays.min}-${plant.phenology.sowing.germinationDays.max} días`}
        />
      </div>
      <CalendarRow label="🌱 Siembra">
        <MonthChips
          months={plant.phenology.sowing.months}
          hemisphere={hemisphere}
        />
      </CalendarRow>

      <CalendarRow label="🌼 Floración">
        <MonthChips
          months={plant.phenology.flowering.months}
          hemisphere={hemisphere}
        />
      </CalendarRow>

      <CalendarRow label="🌾 Cosecha">
        <MonthChips
          months={plant.phenology.harvest.months}
          hemisphere={hemisphere}
        />
      </CalendarRow>
    </BodySection>
  );
}
