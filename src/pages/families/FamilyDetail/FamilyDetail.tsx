import { useParams } from 'react-router-dom';

import { Loader } from '../../../shared/components/Loader/Loader';
import { ErrorResponse } from '../../../shared/components/ErrorResponse/ErrorResponse';
import { NotFound } from '../../../shared/components/NotFound/NotFound';
import { SectionErrorBoundary } from '../../../shared/components/SectionErrorBoundary/SectionErrorBoundary';
import { getDetailViewState } from '../../../shared/reactQuery/detailViewState';

import { useFamily } from '../hooks/useFamily';
import { useFamilyPlants } from '../hooks/useFamilyPlants';

import { FamilyHero } from './components/FamilyHero';
import FamilyPlants from './components/FamilyPlants';
import FamilyInfo from './components/FamilyInfo';

import './familyDetail.css';

export default function FamilyDetail() {
  const { id } = useParams();

  const familyQuery = useFamily(id);
  const plantsQuery = useFamilyPlants(familyQuery.data?.id);
  const viewState = getDetailViewState(id, familyQuery);
  const family = familyQuery.data;

  if (viewState === 'notFound') {
    return (
      <NotFound
        titleKey="notFound.family.title"
        messageKey="notFound.family.message"
        backTo="/families"
        backLabelKey="notFound.backToFamilies"
      />
    );
  }

  if (family) {
    return (
      <div className="family-detail">
        <SectionErrorBoundary section="family.hero">
          <FamilyHero family={family} />
        </SectionErrorBoundary>
        <SectionErrorBoundary section="family.info">
          <FamilyInfo family={family} />
        </SectionErrorBoundary>
        <SectionErrorBoundary section="family.plants">
          <FamilyPlants family={family} query={plantsQuery} />
        </SectionErrorBoundary>
      </div>
    );
  }

  if (viewState === 'error') {
    return (
      <ErrorResponse
        error={familyQuery.error}
        onRetry={() => void familyQuery.refetch()}
      />
    );
  }

  return <Loader labelKey="family.detail.loading" />;
}
