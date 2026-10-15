import { t } from '../../i18n/core/t';
import Icon from '../../shared/components/Icon/Icon';

export default function Login() {
  return (
    <div>
      <Icon name="login" label={t('auth.login')} />
    </div>
  );
}
