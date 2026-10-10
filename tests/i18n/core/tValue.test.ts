import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tValue } from '../../../src/i18n/core/tValue';
import { reportMissingTranslation } from '../../../src/shared/observability/reportMissingTranslation';

vi.mock('../../../src/shared/observability/reportMissingTranslation', () => ({
  reportMissingTranslation: vi.fn()
}));

describe('tValue', () => {
  beforeEach(() => {
    vi.mocked(reportMissingTranslation).mockClear();
  });

  it('builds translation key from base + value', () => {
    expect(tValue('plant.filters.lifeCycleValues', 'annual')).toBe('Anual');
  });

  it('translates a known season without reporting', () => {
    expect(tValue('plant.calendar.seasonValues', 'spring')).toBe('Primavera');
    expect(reportMissingTranslation).not.toHaveBeenCalled();
  });

  it('returns the received value and reports an unknown one', () => {
    expect(tValue('plant.calendar.seasonValues', 'monsoon')).toBe('monsoon');
    expect(reportMissingTranslation).toHaveBeenCalledExactlyOnceWith(
      'plant.calendar.seasonValues.monsoon'
    );
  });

  it('returns an empty value and reports it', () => {
    expect(tValue('plant.calendar.seasonValues', '')).toBe('');
    expect(reportMissingTranslation).toHaveBeenCalledOnce();
  });

  it('translates the plant status values', () => {
    expect(tValue('plant.statusValues', 'ACTIVE')).toBe('Activa');
    expect(tValue('plant.statusValues', 'DELETED')).toBe('Borrada');
    expect(reportMissingTranslation).not.toHaveBeenCalled();
  });
});
