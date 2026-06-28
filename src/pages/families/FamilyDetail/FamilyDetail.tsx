import { useParams } from 'react-router-dom';

import { t } from '../../../i18n/core/t';
import { Loader } from '../../../shared/components/Loader/Loader';
import { ErrorResponse } from '../../../shared/components/ErrorResponse/ErrorResponse';
import { toUiError } from '../../../shared/errors/toUiError';

import { useFamily } from '../hooks/useFamily';
import { useFamilyPlants } from '../hooks/useFamilyPlants';

import { FamilyHero } from './components/FamilyHero';
import FamilyPlants from './components/FamilyPlants';
import FamilyInfo from './components/FamilyInfo';

import './familyDetail.css';

export default function FamilyDetail() {
  const { id } = useParams();

  if (!id) {
    throw new Error('Invalid route: missing family id');
  }

  const familyQuery = useFamily(id);

  const plantsQuery = useFamilyPlants(id);

  const isLoading = familyQuery.isLoading || plantsQuery.loading;

  if (isLoading) {
    return <Loader labelKey="family.detail.loading" />;
  }

  if (familyQuery.error) {
    return <ErrorResponse {...toUiError(familyQuery.error)} />;
  }

  if (plantsQuery.error) {
    return <ErrorResponse {...toUiError(plantsQuery.error)} />;
  }

  const family = familyQuery.data;

  if (!family) {
    return (
      <ErrorResponse {...toUiError(new Error(t('family.detail.not_found')))} />
    );
  }

  return (
    <div className="family-detail">
      <FamilyHero family={family} />
      <FamilyInfo family={family} />
      <FamilyPlants family={family} plants={plantsQuery.data} />
    </div>
  );
}
