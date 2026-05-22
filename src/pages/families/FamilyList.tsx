import { Link } from 'react-router-dom';

import { t } from '../../i18n/core/t';

import { useFamilies } from './hooks/useFamilies';

export default function FamilyList() {
  const { data, loading } = useFamilies();

  if (loading) return <div>{t('common.loading')}</div>;

  return (
    <div>
      <h1>{t('family.families')}</h1>

      <div className="family-grid">
        {data.map((family) => (
          <Link
            key={family.id}
            to={`/families/${family.id}`}
            className="family-card"
          >
            <h3>{family.scientificName}</h3>
            <p>{family.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
