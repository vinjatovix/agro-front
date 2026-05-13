import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { getFamilyById } from '../../services/families.service';
import { getPlants } from '../../services/plants.service';

import type { Family } from '../../types/Family';
import type { Plant } from '../../types/Plant';

export default function FamilyDetail() {
  const { id } = useParams();

  const [family, setFamily] = useState<Family | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;

      try {
        const [familyRes, plantsRes] = await Promise.all([
          getFamilyById(id),
          getPlants({ family: id })
        ]);

        setFamily(familyRes);
        setPlants(plantsRes.data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <div>Loading family...</div>;
  if (!family) return <div>Family not found</div>;

  return (
    <div>
      <h1>{family.scientificName}</h1>
      <p>{family.name}</p>

      <p>{family.shortDescription}</p>

      <h2>Highlights</h2>
      <ul>
        {family.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <section>
        <h2>Explorar</h2>

        <Link to={`/plants?family=${family.id}`}>
          Ver plantas de esta familia
        </Link>
      </section>

      <div className="plant-grid">
        {plants.map((plant) => (
          <Link key={plant.id} to={`/plants/${plant.id}`}>
            {plant.identity.name.primary}
          </Link>
        ))}
      </div>
    </div>
  );
}
