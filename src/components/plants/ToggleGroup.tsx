interface Props {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  renderLabel?: (value: string) => string;
}

export default function ToggleGroup({
  label,
  options,
  value,
  onChange,
  renderLabel
}: Props) {
  function getToggleClass(active: boolean) {
    return active
      ? 'plant-filters__toggle plant-filters__toggle--active'
      : 'plant-filters__toggle';
  }

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
