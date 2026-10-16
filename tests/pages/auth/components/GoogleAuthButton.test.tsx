import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import GoogleAuthButton from '../../../../src/pages/auth/components/GoogleAuthButton';

vi.mock('../../../../src/config/env', () => ({
  GOOGLE_CLIENT_ID: 'test-google-client-id'
}));

describe('GoogleAuthButton', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Google authentication button when client ID is configured', () => {
    render(<GoogleAuthButton onCredential={vi.fn()} />);

    const button = screen.getByRole('button', {
      name: /Continuar con Google/i
    });
    expect(button).toBeInTheDocument();
  });

  it('triggers onCredential callback when clicked', async () => {
    const user = userEvent.setup();
    const handleCredential = vi.fn();
    render(<GoogleAuthButton onCredential={handleCredential} />);

    const button = screen.getByRole('button', {
      name: /Continuar con Google/i
    });
    await user.click(button);

    expect(handleCredential).toHaveBeenCalledTimes(1);
  });

  it('respects disabled state', () => {
    render(<GoogleAuthButton onCredential={vi.fn()} disabled={true} />);

    const button = screen.getByRole('button', {
      name: /Continuar con Google/i
    });
    expect(button).toBeDisabled();
  });

  it('does not render when GOOGLE_CLIENT_ID is empty', async () => {
    vi.resetModules();
    vi.doMock('../../../../src/config/env', () => ({
      GOOGLE_CLIENT_ID: ''
    }));
    const { default: DynamicButton } =
      await import('../../../../src/pages/auth/components/GoogleAuthButton');

    const { container } = render(<DynamicButton />);

    expect(container.firstChild).toBeNull();
  });
});
