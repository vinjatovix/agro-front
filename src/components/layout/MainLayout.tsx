import { Link, Outlet } from 'react-router-dom';
import { t } from '../../i18n/core/t';
import { iconsMap } from '../../shared/constants/iconsMap';

export default function MainLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <Link to="/">
            {iconsMap.harvest} {t('app.brand')}
          </Link>
        </div>

        <nav className="app-nav">
          <Link to="/plants">
            {iconsMap.gardening} {t('app.nav.plants')}
          </Link>
          <Link to="/families">
            {iconsMap.genome} {t('app.nav.families')}
          </Link>
          {/* <Link to="/admin">Admin</Link> */}
        </nav>
      </header>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
