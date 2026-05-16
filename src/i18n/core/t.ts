import { dictionary } from './dictionary';
import type { I18nKey } from './types';

export function t(key: I18nKey): string {
  const parts = key.split('.');
  let value: unknown = dictionary;

  for (const part of parts) {
    if (typeof value === 'object' && value !== null && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }

  return typeof value === 'string' ? value : key;
}
