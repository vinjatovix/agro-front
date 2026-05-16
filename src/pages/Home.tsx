import { t } from '../i18n/core/t';

export default function Home() {
  return (
    <div>
      <h1>{t('app.brand')}</h1>

      <p>{t('app.welcome_message')}</p>
    </div>
  );
}
