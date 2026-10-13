import { useParams } from 'react-router-dom';

import { t } from '../../../i18n/core/t';
import { Loader } from '../../../shared/components/Loader/Loader';
import { ErrorResponse } from '../../../shared/components/ErrorResponse/ErrorResponse';
import { getQueryViewState } from '../../../shared/reactQuery/queryViewState';

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
  const viewState = getQueryViewState(familyQuery);

  const family = familyQuery.data;

  if (!id) {
    return <p role="alert">{t('family.detail.not_found')}</p>;
  }

  if (family) {
    return (
      <div className="family-detail">
        <FamilyHero family={family} />
        <FamilyInfo family={family} />
        <FamilyPlants family={family} query={plantsQuery} />
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
