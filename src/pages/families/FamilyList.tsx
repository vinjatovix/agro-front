import { Link } from 'react-router-dom';

import { t } from '../../i18n/core/t';
import { ErrorResponse } from '../../shared/components/ErrorResponse/ErrorResponse';
import { Loader } from '../../shared/components/Loader/Loader';
import ScientificName from '../../shared/components/ScientificName/ScientificName';
import { getQueryViewState } from '../../shared/reactQuery/queryViewState';

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
  const query = useFamilies();
  const viewState = getQueryViewState(query);

  if (viewState === 'loading') return <Loader />;

  if (viewState === 'error') {
    return (
      <ErrorResponse error={query.error} onRetry={() => void query.refetch()} />
    );
  }

  return (
    <div>
      <h1>{t('family.families')}</h1>

      <FamilyCards families={query.data ?? []} />
    </div>
  );
}
