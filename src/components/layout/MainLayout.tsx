import { Link, Outlet, ScrollRestoration } from 'react-router-dom';

import { t } from '../../i18n/core/t';
import Icon from '../../shared/components/Icon/Icon';

export default function MainLayout() {
  return (
    <div className="app-shell">
      <ScrollRestoration />
      <header className="app-header">
        <div className="app-brand">
          <Link to="/">
            <Icon name="grain" decorative /> {t('app.brand')}
          </Link>
        </div>

        <nav className="app-nav">
          <Link to="/plants">
            <Icon name="eco" decorative /> {t('app.nav.plants')}
          </Link>
          <Link to="/families">
            <Icon name="biotech" decorative /> {t('app.nav.families')}
          </Link>
        </nav>
      </header>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
