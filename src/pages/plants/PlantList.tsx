import { t } from '../../i18n/core/t';

import type { PlantsSortField } from '../../services/plantListQuery';
import { buildPaginationPages } from '../../shared/utils/pagination';
import { toUiError } from '../../shared/errors/toUiError';
import { Loader } from '../../shared/components/Loader/Loader';
import OrderSelector from '../../shared/components/OrderSelector/OrderSelector';
import LimitSelector from '../../shared/components/LimitSelector/LimitSelector';
import Pagination from '../../shared/components/Pagination/Pagination';
import SortFieldSelector from '../../shared/components/SortFieldSelector/SortFieldSelector';
import { ErrorResponse } from '../../shared/components/ErrorResponse/ErrorResponse';

import PlantCard from './PlantCard/PlantCard';
import { usePlants } from './hooks/usePlants';

import './plantList.css';

const SORT_FIELD_LABELS: Record<PlantsSortField, string> = {
  name: t('plant.orders.fields.name'),
  scientificName: t('plant.orders.fields.scientificName')
};

const SORT_FIELD_OPTIONS = Object.entries(SORT_FIELD_LABELS).map(
  ([value, label]) => ({ value: value as PlantsSortField, label })
);

export default function PlantList() {
  const { query, request, setPage, setLimit, setSortField, setSortDirection } =
    usePlants();

  if (query.isLoading) {
    return <Loader />;
  }

  if (query.error) {
    return <ErrorResponse {...toUiError(query.error)} />;
  }

  const plants = query.data?.data ?? [];
  const totalPages = query.data?.pagination.totalPages;
  const page = request.pagination.page;
  const pages = totalPages ? buildPaginationPages(page, totalPages) : [];

  return (
    <div>
      <h1>{t('plant.plants')}</h1>

      <div className="plant-controls">
        <SortFieldSelector<PlantsSortField>
          id="sort-field-select"
          label={t('plant.orders.field')}
          value={request.sort.field}
          options={SORT_FIELD_OPTIONS}
          onChange={setSortField}
        />

        <OrderSelector
          value={request.sort.direction}
          labelAsc={t('plant.orders.asc')}
          labelDes={t('plant.orders.desc')}
          onChange={setSortDirection}
        />

        <LimitSelector value={request.pagination.limit} onChange={setLimit} />
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
