import { useFamilies } from '../../../../../pages/families/hooks/useFamilies';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export default function FamilySelect({ value, onChange }: Props) {
  const { families, loading } = useFamilies();

  if (loading) {
    return (
      <div className="plant-filters__group">
        <label>Family</label>
        <select disabled className="plant-filters__input">
          <option>Loading...</option>
        </select>
      </div>
    );
  }

  return (
    <div className="plant-filters__group">
      <label>Family</label>

      <select
        className="plant-filters__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All families</option>

        {families.map((f) => (
          <option key={f.id} value={f.id}>
            {f.slug}
          </option>
        ))}
      </select>
    </div>
  );
}
