import { describe, it, expect } from 'vitest';
import { tValue } from '../../../src/i18n/core/tValue';

describe('tValue', () => {
  it('builds translation key from base + value', () => {
    expect(tValue('plant.filters.lifeCycleValues', 'annual')).toBe('Anual');
  });
});
