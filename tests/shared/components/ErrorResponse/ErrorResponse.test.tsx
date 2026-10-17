import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { t } from '../../../../src/i18n/core/t';
import { ErrorResponse } from '../../../../src/shared/components/ErrorResponse/ErrorResponse';
import { ApiError } from '../../../../src/shared/errors/ApiError';
import { NetworkError } from '../../../../src/shared/errors/NetworkError';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';

const BACK_MESSAGE = 'Internal Server Error';

function expectGoHomeLinkWithoutRetry() {
  expect(
    screen.getByRole('link', { name: t('errors.actions.goHome') })
  ).toHaveAttribute('href', '/');
  expect(
    screen.queryByRole('button', { name: t('errors.actions.retry') })
  ).not.toBeInTheDocument();
}

describe('ErrorResponse', () => {
  it('shows the translated message and never the back message or status', () => {
    renderWithProviders(
      <ErrorResponse
        error={new ApiError(BACK_MESSAGE, 500)}
        onRetry={vi.fn()}
      />
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(t('errors.unavailable.message'));
    expect(alert).not.toHaveTextContent(BACK_MESSAGE);
    expect(alert).not.toHaveTextContent('500');
  });

  it('calls onRetry when clicking retry', async () => {
    const onRetry = vi.fn();
    renderWithProviders(
      <ErrorResponse
        error={new NetworkError(new TypeError())}
        onRetry={onRetry}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      t('errors.offline.message')
    );
    await userEvent.click(
      screen.getByRole('button', { name: t('errors.actions.retry') })
    );

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('offers no action for a retryable failure without onRetry', () => {
    renderWithProviders(<ErrorResponse error={new Error('boom')} />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      t('errors.unknown.message')
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('links home without retry when forbidden', () => {
    renderWithProviders(
      <ErrorResponse error={new ApiError('Forbidden', 403)} onRetry={vi.fn()} />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      t('errors.forbidden.message')
    );
    expectGoHomeLinkWithoutRetry();
  });

  it('links home without retry when not found', () => {
    renderWithProviders(
      <ErrorResponse error={new ApiError('Not found', 404)} onRetry={vi.fn()} />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      t('errors.notFound.message')
    );
    expectGoHomeLinkWithoutRetry();
  });

  it('links home without retry on a bad request without onClearFilters', () => {
    renderWithProviders(
      <ErrorResponse error={new ApiError('Bad', 400)} onRetry={vi.fn()} />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      t('errors.badRequest.message')
    );
    expectGoHomeLinkWithoutRetry();
  });

  it('offers to clear filters on a bad request with onClearFilters', async () => {
    const onClearFilters = vi.fn();
    renderWithProviders(
      <ErrorResponse
        error={new ApiError('Bad', 400)}
        onRetry={vi.fn()}
        onClearFilters={onClearFilters}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      t('errors.badRequest.listMessage')
    );
    await userEvent.click(
      screen.getByRole('button', { name: t('errors.actions.clearFilters') })
    );

    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });

  it('offers retry and not clear filters for other failures on a filtered list', () => {
    renderWithProviders(
      <ErrorResponse
        error={new ApiError('x', 503)}
        onRetry={vi.fn()}
        onClearFilters={vi.fn()}
      />
    );

    expect(
      screen.getByRole('button', { name: t('errors.actions.retry') })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: t('errors.actions.clearFilters') })
    ).not.toBeInTheDocument();
  });
});
