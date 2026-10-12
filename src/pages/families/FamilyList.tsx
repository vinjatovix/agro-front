import { Link } from 'react-router-dom';

import { t } from '../../i18n/core/t';
import { ErrorResponse } from '../../shared/components/ErrorResponse/ErrorResponse';
import { Loader } from '../../shared/components/Loader/Loader';
import ScientificName from '../../shared/components/ScientificName/ScientificName';
import { toUiError } from '../../shared/errors/toUiError';

import { useFamilies } from '../../shared/hooks/useFamilies';
import type { FamilyListItem } from '../../types/Family';

function FamilyCards({ families }: { readonly families: FamilyListItem[] }) {
  if (families.length === 0) return <p>{t('family.empty')}</p>;

  return (
    <div className="family-grid">
      {families.map((family) => (
        <Link
          key={family.id}
          to={`/families/${family.id}`}
          className="family-card"
        >
          <h3>
            <ScientificName variant="title">
              {family.scientificName}
            </ScientificName>
          </h3>
          <p>{family.name}</p>
        </Link>
      ))}
    </div>
  );
}

export default function FamilyList() {
  const { data, loading, error } = useFamilies();

  if (loading) return <Loader />;

  if (error) return <ErrorResponse {...toUiError(error)} />;

  return (
    <div>
      <h1>{t('family.families')}</h1>

      <FamilyCards families={data} />
    </div>
  );
}
