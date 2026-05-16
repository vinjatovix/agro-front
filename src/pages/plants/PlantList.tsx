import { usePlants } from './hooks/usePlants';

import PlantCard from './PlantCard/PlantCard';

import { buildPaginationPages } from '../../shared/utils/pagination';
import LimitSelector from '../../shared/components/LimitSelector';
import Pagination from '../../shared/components/Pagination/Pagination';
import { t } from '../../i18n/core/t';

interface Props {
  readonly search: string;
}

export default function PlantList({ search }: Props) {
  const { plants, loading, pagination, page, setPage, limit, setLimit } =
    usePlants(search);

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  const pages = pagination
    ? buildPaginationPages(page, pagination.totalPages)
    : [];

  return (
    <div>
      <h1>{t('plant.plants')}</h1>

      <LimitSelector value={limit} onChange={setLimit} />
      <Pagination pages={pages} currentPage={page} onPageChange={setPage} />

      <div className="plant-grid">
        {plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>

      <Pagination pages={pages} currentPage={page} onPageChange={setPage} />
    </div>
  );
}
