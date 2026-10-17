import { FEATURE_SSO_PREVIEW } from '../../../config/features';
import { t } from '../../../i18n/core/t';
import './ssoPreviewButtons.css';

export default function SsoPreviewButtons() {
  if (!FEATURE_SSO_PREVIEW) {
    return null;
  }

  return (
    <div className="sso-preview-group">
      <button
        type="button"
        className="sso-preview-button"
        disabled
        aria-disabled="true"
      >
        <span>{t('auth.github')}</span>
        <span className="sso-preview-badge">{t('auth.sso_preview')}</span>
      </button>

      <button
        type="button"
        className="sso-preview-button"
        disabled
        aria-disabled="true"
      >
        <span>{t('auth.meta')}</span>
        <span className="sso-preview-badge">{t('auth.sso_preview')}</span>
      </button>
    </div>
  );
}
