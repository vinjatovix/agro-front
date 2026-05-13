import { usePlants } from './hooks/usePlants';

import PlantCard from './PlantCard';

import { buildPaginationPages } from '../../shared/utils/pagination';
import LimitSelector from '../../shared/components/LimitSelector';
import Pagination from '../../shared/components/Pagination';

interface Props {
  readonly search: string;
}

export default function PlantList({ search }: Props) {
  const { plants, loading, pagination, page, setPage, limit, setLimit } =
    usePlants(search);

  if (loading) {
    return <div>Loading plants...</div>;
  }

  const pages = pagination
    ? buildPaginationPages(page, pagination.totalPages)
    : [];

  return (
    <div>
      <h1>Plants</h1>

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
