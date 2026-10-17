import { useState, type FormEvent } from 'react';
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  type Location
} from 'react-router-dom';

import { GOOGLE_CLIENT_ID } from '../../config/env';
import { FEATURE_SSO_PREVIEW } from '../../config/features';
import { t } from '../../i18n/core/t';
import { useAuth } from '../../shared/auth/useAuth';
import { validateLoginForm } from '../../shared/auth/validation';
import { ApiError } from '../../shared/errors/ApiError';
import './authPages.css';
import GoogleAuthButton from './components/GoogleAuthButton';
import PasswordField from './components/PasswordField';
import SsoPreviewButtons from './components/SsoPreviewButtons';
import { resolveAuthErrorText } from './utils/authErrorText';

interface ServerErrorState {
  readonly message: string;
  readonly notice?: string;
}

function resolveRedirectDestination(locationState: unknown): string {
  const from = (locationState as { from?: Location })?.from;
  if (
    !from?.pathname ||
    !from.pathname.startsWith('/') ||
    from.pathname.startsWith('//') ||
    from.pathname === '/login' ||
    from.pathname === '/register'
  ) {
    return '/';
  }
  return `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`;
}

export default function Login() {
  const { isAuthenticated, login, googleLogin, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<ServerErrorState | null>(null);

  const destination = resolveRedirectDestination(location.state);

  if (isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setServerError(null);

    const errors = validateLoginForm(email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await login({ email, password });
      navigate(destination, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setServerError({
            message: t('auth.invalid_credentials'),
            notice: t('auth.unverified_account_notice')
          });
          return;
        }
        if (error.status === 429) {
          setServerError({
            message: t('auth.rate_limit_notice')
          });
          return;
        }
      }
      setServerError({
        message: error instanceof Error ? error.message : t('errors.app.title')
      });
    }
  };

  const handleGoogleCredential = async (idToken: string) => {
    try {
      await googleLogin({ idToken });
      navigate(destination, { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        setServerError({
          message: t('auth.rate_limit_notice')
        });
        return;
      }
      setServerError({
        message: error instanceof Error ? error.message : t('errors.app.title')
      });
    }
  };

  const emailErrorText = resolveAuthErrorText(fieldErrors.email);
  const passwordErrorText = resolveAuthErrorText(fieldErrors.password);

  const hasSso = Boolean(GOOGLE_CLIENT_ID.trim()) || FEATURE_SSO_PREVIEW;

  return (
    <div className="auth-container">
      <h1 className="auth-title">{t('auth.login')}</h1>

      {serverError && (
        <div className="auth-alert-error" role="alert">
          <div>{serverError.message}</div>
          {serverError.notice && <div>{serverError.notice}</div>}
        </div>
      )}

      <form
        className="auth-form"
        onSubmit={handleSubmit}
        method="post"
        noValidate
      >
        <div className="auth-field">
          <label htmlFor="login-email" className="auth-label">
            {t('auth.email')}
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`auth-input ${fieldErrors.email ? 'auth-input-error' : ''}`}
            autoComplete="email"
            inputMode="email"
          />
          {emailErrorText && (
            <span className="auth-error-text">{emailErrorText}</span>
          )}
        </div>

        <PasswordField
          id="login-password"
          name="password"
          label={t('auth.password')}
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          error={passwordErrorText}
          labelRight={
            <Link to="/forgot-password" className="auth-label-row-link">
              {t('auth.forgot_link')}
            </Link>
          }
        />

        <button
          type="submit"
          className="auth-submit-button"
          disabled={isLoading}
        >
          {t('auth.login_submit')}
        </button>
      </form>

      {hasSso && (
        <>
          <div className="auth-sso-separator">
            <span>{t('auth.sso_separator')}</span>
          </div>
          <GoogleAuthButton
            onCredential={handleGoogleCredential}
            disabled={isLoading}
          />
          <SsoPreviewButtons />
        </>
      )}

      <div className="auth-footer">
        <Link to="/register" className="auth-footer-link">
          {t('auth.no_account')}
        </Link>
      </div>
    </div>
  );
}
