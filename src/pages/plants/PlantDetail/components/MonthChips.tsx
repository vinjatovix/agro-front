import { MONTHS } from '../../../../components/plants/PlantFilters/constants';
import { mapMonth } from '../../../../components/plants/PlantFilters/utils/month.utils';

import './monthChips.css';

interface Props {
  readonly months: number[];
  readonly hemisphere: 'north' | 'south';
}

export default function MonthChips({ months, hemisphere }: Props) {
  return (
    <div className="month-chips">
      {MONTHS.map((monthName, index) => {
        const displayMonth = index + 1;

        const backendMonth = mapMonth(displayMonth, hemisphere);

        const active = months.includes(backendMonth);

        return (
          <span
            key={monthName}
            className={active ? 'month-chip month-chip--active' : 'month-chip'}
          >
            {monthName}
          </span>
        );
      })}
    </div>
  );
}
