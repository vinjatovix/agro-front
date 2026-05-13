interface Props {
  readonly label: string;
  readonly options: readonly string[];
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly renderLabel?: (value: string) => string;
}

export default function ToggleGroup({
  label,
  options,
  value,
  onChange,
  renderLabel
}: Props) {
  return (
    <div className="plant-filters__group">
      <label>{label}</label>

      <div className="plant-filters__buttons">
        {options.map((option) => (
          <button
            key={option}
            type="button"
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
