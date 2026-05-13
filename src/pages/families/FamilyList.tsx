import { Link } from 'react-router-dom';

import { useFamilies } from './hooks/useFamilies';

export default function FamilyList() {
  const { families, loading } = useFamilies();

  if (loading) return <div>Loading families...</div>;

  return (
    <div>
      <h1>Families</h1>

      <div className="family-grid">
        {families.map((family) => (
          <Link
            key={family.id}
            to={`/families/${family.id}`}
            className="family-card"
          >
            <h3>{family.scientificName}</h3>
            <p>{family.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
