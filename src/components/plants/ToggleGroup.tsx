import { useId } from 'react';

interface Props {
  readonly label: string;
  readonly options: readonly string[];
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly renderLabel?: (value: string) => string;
  readonly describedBy?: string;
}

export default function ToggleGroup({
  label,
  options,
  value,
  onChange,
  renderLabel,
  describedBy
}: Props) {
  const labelId = useId();

  return (
    <div
      className="plant-filters__group"
      role="group"
      aria-labelledby={labelId}
      aria-describedby={describedBy}
    >
      <span id={labelId} className="plant-filters__group-label">
        {label}
      </span>

      <div className="plant-filters__buttons">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            className={getToggleClass(value === option)}
            onClick={() => onChange(option)}
          >
            {renderLabel ? renderLabel(option) : option}
          </button>
        ))}
      </div>
    </div>
  );
}

function getToggleClass(active: boolean) {
  return active
    ? 'plant-filters__toggle plant-filters__toggle--active'
    : 'plant-filters__toggle';
}
