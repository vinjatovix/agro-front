import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getPlantById } from '../../services/plants.service';
import type { Plant } from '../../types/Plant';
import { capitalizeFirstLetter } from '../../shared/utils/capitalizeFirstLetter';
import { findPlantImage } from './utils/findPlantImage';

export default function PlantDetail() {
  const { id } = useParams();

  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlant(null);
      setLoading(false);
      return;
    }
    async function loadPlant() {
      if (!id) return;

      try {
        const response = await getPlantById(id);
        setPlant(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadPlant();
  }, [id]);

  if (loading) {
    return <div>Loading plant...</div>;
  }

  if (!plant) {
    return <div>Plant not found</div>;
  }

  const imageUrl = findPlantImage(plant);
  return (
    <div className="plant-detail">
      <h1>{capitalizeFirstLetter(plant.identity.name.primary)}</h1>
      {imageUrl && <img src={imageUrl} alt={plant.identity.name.primary} />}

      {plant.identity.scientificName && (
        <p className="scientific">
          {capitalizeFirstLetter(plant.identity.scientificName)}
        </p>
      )}

      <p>
        <strong>Family:</strong> {plant.identity.family}
      </p>

      {/* TRAITS */}
      <section>
        <h2>Traits</h2>

        <p>
          <strong>Lifecycle:</strong> {plant.traits.lifecycle}
        </p>

        <p>
          <strong>Spacing:</strong> {plant.traits.spacingCm.min} -{' '}
          {plant.traits.spacingCm.max} cm
        </p>
      </section>

      {/* PHENOLOGY */}
      <section>
        <h2>Phenology</h2>

        <div>
          <h3>Sowing months</h3>
          <p>{plant.phenology.sowing.months.join(', ')}</p>
        </div>

        <div>
          <h3>Harvest months</h3>
          <p>{plant.phenology.harvest?.months?.join(', ') || 'N/A'}</p>
        </div>
      </section>
    </div>
  );
}
