import { usePlants } from './hooks/usePlants';

import PlantCard from './PlantCard/PlantCard';

import { buildPaginationPages } from '../../shared/utils/pagination';
import OrderSelector from '../../shared/components/OrderSelector/OrderSelector';
import LimitSelector from '../../shared/components/LimitSelector/LimitSelector';
import Pagination from '../../shared/components/Pagination/Pagination';
import { t } from '../../i18n/core/t';

import './plantList.css';

interface Props {
  readonly search: string;
}

export default function PlantList({ search }: Props) {
  const {
    plants,
    loading,
    pagination,
    page,
    setPage,
    limit,
    setLimit,
    sortDirection,
    setSortDirection
  } = usePlants(search);

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  const pages = pagination
    ? buildPaginationPages(page, pagination.totalPages)
    : [];

  return (
    <div>
      <h1>{t('plant.plants')}</h1>

      <div className="plant-controls">
        <OrderSelector
          value={sortDirection}
          labelAsc={t('plant.orders.asc')}
          labelDes={t('plant.orders.desc')}
          onChange={setSortDirection}
        />
        <LimitSelector value={limit} onChange={setLimit} />
      </div>

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
