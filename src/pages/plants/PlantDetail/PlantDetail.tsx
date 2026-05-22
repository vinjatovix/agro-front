import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { t } from '../../../i18n/core/t';
import { ErrorResponse } from '../../../shared/components/ErrorResponse/ErrorResponse';
import { toUiError } from '../../../shared/errors/toUiError';

import { usePlant } from '../hooks/usePlant';

import { PlantDetailStickyHeader } from './components/PlantDetailStickyHeader';
import PlantHero from './components/PlantHero';
import QuickFacts from './components/QuickFacts';
import PlantCalendar from './components/PlantCalendar';
import PlantCultivation from './components/PlantCultivation';
import PlantEcology from './components/PlantEcology';
import PlantNotes from './components/PlantNotes';
import PlantResources from './components/PlantResources/PlantResources';

import './plantDetail.css';

export default function PlantDetail() {
  const { id } = useParams();

  if (!id) {
    throw new Error('Invalid route: missing plant id');
  }

  const [hemisphere, setHemisphere] = useState<'north' | 'south'>('north');
  const plantQuery = usePlant(id);

  if (plantQuery.isLoading) {
    return <div>{t('plant.detail.loading')}</div>;
  }

  if (plantQuery.error) {
    return <ErrorResponse {...toUiError(plantQuery.error)} />;
  }
  if (!plantQuery.data) {
    return (
      <ErrorResponse {...toUiError(new Error(t('plant.detail.not_found')))} />
    );
  }

  const plant = plantQuery.data;

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
