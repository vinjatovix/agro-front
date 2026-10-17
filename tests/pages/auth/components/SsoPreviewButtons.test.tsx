import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SsoPreviewButtons from '../../../../src/pages/auth/components/SsoPreviewButtons';

vi.mock('../../../../src/config/features', () => ({
  FEATURE_SSO_PREVIEW: true
}));

describe('SsoPreviewButtons', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders disabled GitHub and Meta preview buttons when feature flag is enabled', () => {
    render(<SsoPreviewButtons />);

    const githubButton = screen.getByRole('button', { name: /github/i });
    const metaButton = screen.getByRole('button', { name: /meta/i });

    expect(githubButton).toBeInTheDocument();
    expect(githubButton).toBeDisabled();
    expect(metaButton).toBeInTheDocument();
    expect(metaButton).toBeDisabled();
  });

  it('displays próximamente label on both buttons', () => {
    render(<SsoPreviewButtons />);

    const badges = screen.getAllByText('próximamente');
    expect(badges).toHaveLength(2);
  });

  it('does not trigger action when clicked because buttons are disabled', async () => {
    const user = userEvent.setup();
    render(<SsoPreviewButtons />);

    const githubButton = screen.getByRole('button', { name: /github/i });
    await user.click(githubButton);

    expect(githubButton).toBeDisabled();
  });

  it('renders nothing when feature flag is disabled', async () => {
    vi.resetModules();
    vi.doMock('../../../../src/config/features', () => ({
      FEATURE_SSO_PREVIEW: false
    }));
    const { default: DynamicSsoButtons } =
      await import('../../../../src/pages/auth/components/SsoPreviewButtons');

    const { container } = render(<DynamicSsoButtons />);

    expect(container.firstChild).toBeNull();
  });
});
