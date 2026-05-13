import { SUPPORTED_LIMITS } from './constants';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function LimitSelector({ value, onChange }: Props) {
  return (
    <div style={{ marginBottom: 16, marginTop: 16 }}>
      <label htmlFor="limit-select">Results per page:</label>

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
