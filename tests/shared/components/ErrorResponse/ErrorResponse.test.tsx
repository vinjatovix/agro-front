import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ErrorResponse } from '../../../../src/shared/components/ErrorResponse/ErrorResponse';

describe('ErrorResponse', () => {
  it('renders message', () => {
    render(<ErrorResponse message="Something failed" />);

    expect(screen.getByText(/something failed/i)).toBeInTheDocument();
  });

  it('renders details when provided', () => {
    render(
      <ErrorResponse
        message="Error"
        details={['field required', 'invalid format']}
      />
    );

    expect(screen.getByText(/field required/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid format/i)).toBeInTheDocument();
  });
});
