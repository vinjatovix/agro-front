import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from './createTestQueryClient';

export function renderWithProviders(
  ui: React.ReactNode,
  options?: { route?: string }
) {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[options?.route ?? '/']}>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}
