import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FamilyHero } from './components/FamilyHero';
import type { Family } from '../../../types/Family';
import type { Plant } from '../../../types/Plant';
import { getFamilyById } from '../../../services/families.service';
import { getPlants } from '../../../services/plants.service';

import './familyDetail.css';
import FamilyPlants from './components/FamilyPlants';
import FamilyInfo from './components/FamilyInfo';

export default function FamilyDetail() {
  const { id } = useParams();

  const [family, setFamily] = useState<Family | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFamily(null);
      setPlants([]);
      setError(null);
      setLoading(false);

      return;
    }

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [familyRes, plantsRes] = await Promise.all([
          getFamilyById(id as string),
          getPlants({ family: id as string })
        ]);

        setFamily(familyRes);
        setPlants(plantsRes.data);
      } catch (error) {
        setFamily(null);
        setPlants([]);

        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);
  if (loading) return <div>Loading family...</div>;
  if (error) return <div role="alert">{error}</div>;
  if (!family) return <div>Family not found</div>;

  return (
    <div className="family-detail">
      <FamilyHero family={family} />

      <FamilyInfo family={family} />

      <FamilyPlants family={family} plants={plants} />
    </div>
  );
}
