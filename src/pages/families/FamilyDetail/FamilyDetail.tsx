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

export default function FamilyDetail() {
  const { id } = useParams();

  if (!id) {
    throw new Error('Invalid route: missing family id');
  }

  const familyQuery = useFamily(id);

  const [plants, setPlants] = useState<Plant[]>([]);
  const [loadingPlants, setLoadingPlants] = useState(true);
  const [plantsError, setPlantsError] = useState<string | null>(null);

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
        setPlantsError(
          error instanceof Error ? error.message : t('common.unknown_error')
        );
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
    return (
      <div role="alert">
        {familyQuery.error instanceof Error
          ? familyQuery.error.message
          : t('common.unknown_error')}
      </div>
    );
  }

  if (plantsError) {
    return <div role="alert">{plantsError}</div>;
  }

  if (!familyQuery.data) {
    return <div role="alert">{t('family.detail.not_found')}</div>;
  }

  return (
    <div className="family-detail">
      <FamilyHero family={familyQuery.data} />
      <FamilyInfo family={familyQuery.data} />
      <FamilyPlants family={familyQuery.data} plants={plants} />
    </div>
  );
}
