import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';

window.scrollTo = vi.fn();

beforeEach(() => {
  vi.mocked(window.scrollTo).mockClear();
});
