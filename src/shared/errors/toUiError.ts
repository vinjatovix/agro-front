import { t } from '../../i18n/core/t';
import type { UiError } from '../components/ErrorResponse/types';
import { ApiError } from './ApiError';

export function toUiError(error: unknown): UiError {
  if (!error) {
    return { message: t('common.unknown_error') };
  }

  if (error instanceof ApiError) {
    return {
      message: error.message,
      details: error.errors ? Object.values(error.errors) : undefined
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: t('common.unknown_error') };
}
