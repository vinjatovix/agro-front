import { t } from '../../i18n/core/t';

import type { PlantsSortField } from '../../services/plantListQuery';
import type { PaginatedResponse } from '../../types/api';
import type { PlantListItem } from '../../types/Plants/Plant';
import { buildPaginationPages } from '../../shared/utils/pagination';
import { getQueryViewState } from '../../shared/reactQuery/queryViewState';
import { Loader } from '../../shared/components/Loader/Loader';
import OrderSelector from '../../shared/components/OrderSelector/OrderSelector';
import LimitSelector from '../../shared/components/LimitSelector/LimitSelector';
import Pagination from '../../shared/components/Pagination/Pagination';
import SortFieldSelector from '../../shared/components/SortFieldSelector/SortFieldSelector';
import { ErrorResponse } from '../../shared/components/ErrorResponse/ErrorResponse';

import PlantCard from './PlantCard/PlantCard';
import { usePlants } from './hooks/usePlants';
import {
  getPlantListEmptyState,
  type PlantListEmptyState
} from './utils/getPlantListEmptyState';

import './plantList.css';

const SORT_FIELD_LABELS: Record<PlantsSortField, string> = {
  name: t('plant.orders.fields.name'),
  scientificName: t('plant.orders.fields.scientificName')
};

const SORT_FIELD_OPTIONS = Object.entries(SORT_FIELD_LABELS).map(
  ([value, label]) => ({ value: value as PlantsSortField, label })
);

const EMPTY_STATE_MESSAGE_KEYS = {
  outOfRange: 'plant.emptyState.outOfRange',
  noMatches: 'plant.emptyState.noMatches',
  emptyCatalog: 'plant.emptyState.emptyCatalog'
} as const;

interface PlantListEmptyProps {
  readonly state: PlantListEmptyState;
  readonly onClearFilters: () => void;
  readonly onGoToFirstPage: () => void;
}

function PlantListEmptyAction({
  state,
  onClearFilters,
  onGoToFirstPage
}: PlantListEmptyProps) {
  if (state === 'emptyCatalog') return null;
  const [label, onClick] =
    state === 'noMatches'
      ? [t('errors.actions.clearFilters'), onClearFilters]
      : [t('plant.emptyState.goToFirstPage'), onGoToFirstPage];

  return (
    <button
      type="button"
      className="plant-list__empty-action"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function PlantListEmpty(props: PlantListEmptyProps) {
  return (
    <div className="plant-list__empty">
      <p role="status" className="plant-list__empty-message">
        {t(EMPTY_STATE_MESSAGE_KEYS[props.state])}
      </p>
      <PlantListEmptyAction {...props} />
    </div>
  );
}

function readPlantListPage(
  response: PaginatedResponse<PlantListItem> | undefined,
  page: number
) {
  const totalPages = response?.pagination.totalPages ?? 0;
  return {
    plants: response?.data ?? [],
    totalItems: response?.pagination.totalItems ?? 0,
    pages: totalPages > 0 ? buildPaginationPages(page, totalPages) : []
  };
}

export default function PlantList() {
  const {
    query,
    request,
    hasActiveFilters,
    setPage,
    goToFirstPage,
    clearFilters,
    setLimit,
    setSortField,
    setSortDirection
  } = usePlants();

  const viewState = getQueryViewState(query);

  if (viewState === 'loading') {
    return <Loader />;
  }

  if (viewState === 'error') {
    return (
      <ErrorResponse
        error={query.error}
        onRetry={() => void query.refetch()}
        onClearFilters={hasActiveFilters ? clearFilters : undefined}
      />
    );
  }

  const page = request.pagination.page;
  const { plants, totalItems, pages } = readPlantListPage(query.data, page);

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

      {plants.length === 0 ? (
        <PlantListEmpty
          state={getPlantListEmptyState({ page, totalItems, hasActiveFilters })}
          onClearFilters={clearFilters}
          onGoToFirstPage={goToFirstPage}
        />
      ) : (
        <div className="plant-grid">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}

      <Pagination pages={pages} currentPage={page} onPageChange={setPage} />
    </div>
  );
}
