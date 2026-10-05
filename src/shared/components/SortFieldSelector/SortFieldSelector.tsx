interface SortFieldOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

interface Props<T extends string> {
  readonly id: string;
  readonly label: string;
  readonly value: T;
  readonly options: readonly SortFieldOption<T>[];
  readonly onChange: (value: T) => void;
}

export default function SortFieldSelector<T extends string>({
  id,
  label,
  value,
  options,
  onChange
}: Props<T>) {
  function handleChange(selected: string) {
    const option = options.find((candidate) => candidate.value === selected);
    if (option) onChange(option.value);
  }

  return (
    <>
      <label htmlFor={id}>{label}: </label>
      <select
        id={id}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}
