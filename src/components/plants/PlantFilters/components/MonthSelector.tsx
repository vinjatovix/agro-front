import { MONTHS } from '../constants';
import { mapMonth } from '../utils/month.utils';

interface Props {
  hemisphere: 'north' | 'south';
  value: string;
  onChange: (value: string) => void;
}

export default function MonthSelector({ hemisphere, value, onChange }: Props) {
  return (
    <div className="plant-filters__group">
      <label>Sowing months</label>

      <div className="plant-filters__buttons plant-filters__buttons--wrap">
        {MONTHS.map((monthName, index) => {
          const displayMonth = index + 1;

          const backendMonth = mapMonth(displayMonth, hemisphere);

          const active = value === String(backendMonth);

          return (
            <button
              key={monthName}
              type="button"
              className={
                active
                  ? 'plant-filters__toggle plant-filters__toggle--active'
                  : 'plant-filters__toggle'
              }
              onClick={() => onChange(active ? '' : String(backendMonth))}
            >
              {monthName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
