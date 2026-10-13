import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Loader } from '../../../shared/components/Loader/Loader';
import { ErrorResponse } from '../../../shared/components/ErrorResponse/ErrorResponse';
import { getQueryViewState } from '../../../shared/reactQuery/queryViewState';

import { usePlant } from '../hooks/usePlant';
import { readPlantSafety } from '../utils/plantSafety';

import { PlantDetailStickyHeader } from './components/PlantDetailStickyHeader';
import PlantHero from './components/PlantHero';
import QuickFacts from './components/QuickFacts';
import PlantCalendar from './components/PlantCalendar';
import PlantSafety from './components/PlantSafety';
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

  const plant = plantQuery.data;

  if (!plant) {
    return getQueryViewState(plantQuery) === 'error' ? (
      <ErrorResponse
        error={plantQuery.error}
        onRetry={() => void plantQuery.refetch()}
      />
    ) : (
      <Loader labelKey="plant.detail.loading" />
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
      <PlantSafety safety={readPlantSafety(plant)} />
      <PlantCultivation plant={plant} />
      <PlantEcology plant={plant} />
      <PlantNotes plant={plant} />
      <PlantResources plant={plant} />
    </div>
  );
}
