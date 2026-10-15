import { Outlet } from 'react-router-dom';

import { t } from '../../i18n/core/t';
import Icon from '../../shared/components/Icon/Icon';

export default function AuthLayout() {
  return (
    <div>
      <h1>
        <Icon name="lock" label={t('auth.heading')} />
      </h1>

      <Outlet />
    </div>
  );
}
