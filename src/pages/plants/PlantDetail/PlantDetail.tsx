import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { t } from '../../../i18n/core/t';
import { getPlantById } from '../../../services/plants.service';
import type { Plant } from '../../../types/Plants/Plant';

import { PlantDetailStickyHeader } from './components/PlantDetailStickyHeader';
import PlantHero from './components/PlantHero';
import QuickFacts from './components/QuickFacts';
import PlantCalendar from './components/PlantCalendar';
import PlantCultivation from './components/PlantCultivation';
import PlantEcology from './components/PlantEcology';
import PlantNotes from './components/PlantNotes';
import PlantResources from './components/PlantResources/PlantResources';

import './plantDetail.css';
import type { UiError } from '../../../shared/components/ErrorResponse/types';
import { toUiError } from '../../../shared/errors/toUiError';
import { ErrorResponse } from '../../../shared/components/ErrorResponse/ErrorResponse';

export default function PlantDetail() {
  const { id } = useParams();

  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<UiError | null>(null);

  const [hemisphere, setHemisphere] = useState<'north' | 'south'>('north');

  useEffect(() => {
    async function loadPlant() {
      if (!id) {
        setPlant(null);
        setError(null);
        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError(null);
        setPlant(null);

        const response = await getPlantById(id);

        setPlant(response);
      } catch (error) {
        setPlant(null);

        setError(toUiError(error));
      } finally {
        setLoading(false);
      }
    }

    loadPlant();
  }, [id]);

  if (loading) {
    return <div>{t('plant.detail.loading')}</div>;
  }
  if (error) {
    return <ErrorResponse {...error} />;
  }
  if (!plant) {
    return (
      <ErrorResponse {...toUiError(new Error(t('plant.detail.not_found')))} />
    );
  }

  return (
    <div className="plant-detail">
      <PlantDetailStickyHeader plant={plant} />

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
