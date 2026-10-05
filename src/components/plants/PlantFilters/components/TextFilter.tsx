interface Props {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly testId?: string;
  readonly icon?: string;
  readonly maxLength?: number;
}

export default function TextFilter({
  icon,
  label,
  value,
  onChange,
  placeholder,
  testId,
  maxLength
}: Props) {
  return (
    <div className="plant-filters__group">
      <label>
        {icon ? `${icon} ` : ''}
        {label}
        <input
          className="plant-filters__input"
          data-testid={testId}
          placeholder={placeholder}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
