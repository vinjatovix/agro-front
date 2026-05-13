import { useState } from 'react';

import PlantFilters from '../../components/plants/PlantFilters/PlantFilters';
import PlantList from './PlantList';

export default function PlantsPage() {
  const [search, setSearch] = useState('');

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 60px)'
      }}
    >
      <aside
        style={{
          width: 320,
          borderRight: '1px solid #ddd',
          padding: 16,
          overflowY: 'auto'
        }}
      >
        <PlantFilters search={search} onSearchChange={setSearch} />
      </aside>

      <main
        style={{
          flex: 1,
          padding: 16,
          overflowY: 'auto'
        }}
      >
        <PlantList search={search} />
      </main>
    </div>
  );
}
