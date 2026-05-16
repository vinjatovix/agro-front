import { useState } from 'react';

import { t } from '../../i18n/core/t';
import useMediaQuery from '../../shared/hooks/useMediaQuery';
import useDrawer from '../../shared/hooks/useDrawer';
import Drawer from '../../shared/components/Drawer/Drawer';
import PlantFilters from '../../components/plants/PlantFilters/PlantFilters';
import PlantList from './PlantList';

import './plantsPage.css';

export default function PlantsPage() {
  const [search, setSearch] = useState('');

  const isMobile = useMediaQuery('(max-width: 768px)');
  const drawer = useDrawer(false);

  return (
    <div className="plants-layout">
      {!isMobile && (
        <aside className="plants-sidebar">
          <PlantFilters search={search} onSearchChange={setSearch} />
        </aside>
      )}

      {isMobile && !drawer.isOpen && (
        <button type="button" onClick={drawer.open} className="plants-fab">
          {t('common.filters')}
        </button>
      )}

      {isMobile && (
        <Drawer isOpen={drawer.isOpen} onClose={drawer.close}>
          <PlantFilters search={search} onSearchChange={setSearch} />
        </Drawer>
      )}

      <main className="plants-main">
        <PlantList search={search} />
      </main>
    </div>
  );
}
