import { t } from '../../i18n/core/t';
import { SUPPORTED_LIMITS } from './constants';

interface Props {
  readonly value: number;
  readonly onChange: (value: number) => void;
}

export default function LimitSelector({ value, onChange }: Props) {
  return (
    <div style={{ marginBottom: 16, marginTop: 16 }}>
      <label htmlFor="limit-select">{t('common.results_per_page')}: </label>

      <select
        id="limit-select"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {SUPPORTED_LIMITS.map((limit) => (
          <option key={limit} value={limit}>
            {limit}
          </option>
        ))}
      </select>
    </div>
  );
}
