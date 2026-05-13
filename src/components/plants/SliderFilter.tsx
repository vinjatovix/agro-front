import { useId } from 'react';

interface Props {
  label: string;
  value: number | null;
  min: number;
  max: number;
  step: number;
  onChange: (value: number | null) => void;
  onCommit: (value: number | null) => void;
}

export default function SliderFilter({
  label,
  value,
  min,
  max,
  step,
  onChange,
  onCommit
}: Props) {
  const sliderId = useId();

  return (
    <div className="plant-filters__group">
      <div className="plant-filters__label-row">
        <label className="plant-filters__label" htmlFor={sliderId}>
          {label} {value}
        </label>

        {value !== null && (
          <button
            type="button"
            className="plant-filters__slider-clear"
            onClick={() => {
              onChange(null);
              onCommit(null);
            }}
          >
            Clear
          </button>
        )}
      </div>

      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? min}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={(e) => onCommit(Number(e.currentTarget.value))}
      />
    </div>
  );
}
