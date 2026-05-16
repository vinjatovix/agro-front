import { describe, it, expect } from 'vitest';
import { t } from '../../../src/i18n/core/t';

describe('t', () => {
  it('returns translated value for valid key', () => {
    expect(t('common.loading')).toBe('Cargando...');
  });

  it('returns key when translation does not exist', () => {
    expect(t('non.existing.key' as unknown as keyof typeof t)).toBe(
      'non.existing.key'
    );
  });

  it('supports nested keys', () => {
    expect(t('family.hero.order')).toBe('Orden');
  });

  it('returns key when intermediate path is invalid', () => {
    expect(t('family.invalid.key' as unknown as keyof typeof t)).toBe(
      'family.invalid.key'
    );
  });
});
