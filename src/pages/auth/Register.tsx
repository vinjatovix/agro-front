import { t } from '../../i18n/core/t';
import Icon from '../../shared/components/Icon/Icon';

export default function Register() {
  return (
    <div>
      <Icon name="person_add" label={t('auth.register')} />
    </div>
  );
}
