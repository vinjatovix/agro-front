import { t } from '../../i18n/core/t';

import { buildPaginationPages } from '../../shared/utils/pagination';
import { toUiError } from '../../shared/errors/toUiError';
import { Loader } from '../../shared/components/Loader/Loader';
import OrderSelector from '../../shared/components/OrderSelector/OrderSelector';
import LimitSelector from '../../shared/components/LimitSelector/LimitSelector';
import Pagination from '../../shared/components/Pagination/Pagination';
import { ErrorResponse } from '../../shared/components/ErrorResponse/ErrorResponse';

import PlantCard from './PlantCard/PlantCard';
import { usePlants } from './hooks/usePlants';

import './plantList.css';

export default function PlantList() {
  const {
    data,
    pagination,
    loading,
    error,
    page,
    setPage,
    limit,
    setLimit,
    sortDirection,
    setSortDirection
  } = usePlants();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorResponse {...toUiError(error)} />;
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
        {data.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>

      <Pagination pages={pages} currentPage={page} onPageChange={setPage} />
    </div>
  );
}
