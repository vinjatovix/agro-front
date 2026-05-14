interface Props {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
}

export default function TextFilter({
  label,
  value,
  onChange,
  placeholder
}: Props) {
  return (
    <div className="plant-filters__group">
      <label>
        {label}

        <input
          className="plant-filters__input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
