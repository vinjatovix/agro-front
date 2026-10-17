import { t } from '../../i18n/core/t';
import Icon from '../../shared/components/Icon/Icon';

export default function AdminDashboard() {
  return (
    <div>
      <Icon name="admin_panel_settings" label={t('admin.heading')} />
    </div>
  );
}
