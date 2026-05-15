// PlantDetail.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getPlantById } from '../../../services/plants.service';

import type { Plant } from '../../../types/Plant';

import PlantHero from './components/PlantHero';
import QuickFacts from './components/QuickFacts';
import PlantCalendar from './components/PlantCalendar';
import PlantCultivation from './components/PlantCultivation';
import PlantEcology from './components/PlantEcology';
import PlantNotes from './components/PlantNotes';
import PlantResources from './components/PlantResources';

import './plantDetail.css';

export default function PlantDetail() {
  const { id } = useParams();

  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  const [hemisphere, setHemisphere] = useState<'north' | 'south'>('north');

  useEffect(() => {
    async function loadPlant() {
      if (!id) {
        setPlant(null);
        setLoading(false);
        return;
      }

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

  return (
    <div className="plant-detail">
      <PlantHero plant={plant} />
      <PlantCalendar
        plant={plant}
        hemisphere={hemisphere}
        onHemisphereChange={setHemisphere}
      />

      <QuickFacts plant={plant} />
      <PlantCultivation plant={plant} />

      <PlantEcology plant={plant} />

      <PlantNotes plant={plant} />

      <PlantResources plant={plant} />
    </div>
  );
}
