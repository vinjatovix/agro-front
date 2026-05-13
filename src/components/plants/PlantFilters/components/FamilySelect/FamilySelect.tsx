import { useId } from 'react';
import { useFamilies } from '../../../../../pages/families/hooks/useFamilies';

interface Props {
  readonly value: string;
  readonly onChange: (id: string) => void;
}

export default function FamilySelect({ value, onChange }: Props) {
  const { families, loading } = useFamilies();
  const selectId = useId();

  return (
    <div className="plant-filters__group">
      <label htmlFor={selectId}>Family</label>

      <select
        id={selectId}
        className="plant-filters__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      >
        {loading ? (
          <option>Loading...</option>
        ) : (
          <>
            <option value="">All families</option>

            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.slug}
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );
}
