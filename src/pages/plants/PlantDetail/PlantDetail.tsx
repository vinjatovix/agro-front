import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Loader } from '../../../shared/components/Loader/Loader';
import { ErrorResponse } from '../../../shared/components/ErrorResponse/ErrorResponse';
import { NotFound } from '../../../shared/components/NotFound/NotFound';
import { SectionErrorBoundary } from '../../../shared/components/SectionErrorBoundary/SectionErrorBoundary';
import { getDetailViewState } from '../../../shared/reactQuery/detailViewState';

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
  const [hemisphere, setHemisphere] = useState<'north' | 'south'>('north');
  const plantQuery = usePlant(id);
  const viewState = getDetailViewState(id, plantQuery);
  const plant = plantQuery.data;

  if (viewState === 'notFound') {
    return (
      <NotFound
        titleKey="notFound.plant.title"
        messageKey="notFound.plant.message"
        backTo="/plants"
        backLabelKey="notFound.backToPlants"
      />
    );
  }

  if (!plant) {
    return viewState === 'error' ? (
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
      <SectionErrorBoundary section="plant.hero">
        <PlantDetailStickyHeader plant={plant} />
        <PlantHero plant={plant} />
      </SectionErrorBoundary>
      <SectionErrorBoundary section="plant.calendar">
        <PlantCalendar
          plant={plant}
          hemisphere={hemisphere}
          onHemisphereChange={setHemisphere}
        />
      </SectionErrorBoundary>
      <SectionErrorBoundary section="plant.quickFacts">
        <QuickFacts plant={plant} />
      </SectionErrorBoundary>
      <SectionErrorBoundary section="plant.safety">
        <PlantSafety safety={readPlantSafety(plant)} />
      </SectionErrorBoundary>
      <SectionErrorBoundary section="plant.cultivation">
        <PlantCultivation plant={plant} />
      </SectionErrorBoundary>
      <SectionErrorBoundary section="plant.ecology">
        <PlantEcology plant={plant} />
      </SectionErrorBoundary>
      <SectionErrorBoundary section="plant.notes">
        <PlantNotes plant={plant} />
      </SectionErrorBoundary>
      <SectionErrorBoundary section="plant.resources">
        <PlantResources plant={plant} />
      </SectionErrorBoundary>
    </div>
  );
}
