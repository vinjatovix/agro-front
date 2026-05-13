interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TextFilter({ label, value, onChange }: Props) {
  return (
    <div className="plant-filters__group">
      <label>{label}</label>

      <input
        className="plant-filters__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
