import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { t } from '../../../i18n/core/t';
import type { Plant } from '../../../types/Plants/Plant';
import { getPlants } from '../../../services/plants.service';

import { useFamily } from '../hooks/useFamily';

import { FamilyHero } from './components/FamilyHero';
import FamilyPlants from './components/FamilyPlants';
import FamilyInfo from './components/FamilyInfo';

import './familyDetail.css';
import { ErrorResponse } from '../../../shared/components/ErrorResponse/ErrorResponse';
import { toUiError } from '../../../shared/errors/toUiError';
import type { UiError } from '../../../shared/components/ErrorResponse/types';

export default function FamilyDetail() {
  const { id } = useParams();

  if (!id) {
    throw new Error('Invalid route: missing family id');
  }

  const familyQuery = useFamily(id);

  const [plants, setPlants] = useState<Plant[]>([]);
  const [loadingPlants, setLoadingPlants] = useState(true);
  const [plantsError, setPlantsError] = useState<UiError | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadPlants() {
      try {
        setLoadingPlants(true);
        setPlantsError(null);

        const plantsRes = await getPlants({ family: id });

        if (!isActive) return;

        setPlants(plantsRes.data);
      } catch (error) {
        if (!isActive) return;

        setPlants([]);
        setPlantsError(toUiError(error));
      }

      if (!isActive) return;

      setLoadingPlants(false);
    }

    loadPlants();

    return () => {
      isActive = false;
    };
  }, [id]);

  if (familyQuery.isLoading || loadingPlants) {
    return <div>{t('family.detail.loading')}</div>;
  }

  if (familyQuery.error) {
    return <ErrorResponse {...toUiError(familyQuery.error)} />;
  }

  if (plantsError) {
    return <ErrorResponse {...plantsError} />;
  }

  if (!familyQuery.data) {
    return (
      <ErrorResponse {...toUiError(new Error(t('family.detail.not_found')))} />
    );
  }

  const family = familyQuery.data;

  return (
    <div className="family-detail">
      <FamilyHero family={family} />
      <FamilyInfo family={family} />
      <FamilyPlants family={family} plants={plants} />
    </div>
  );
}
