import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Badge from '../../../../src/shared/components/Badge/Badge';

describe('Badge', () => {
  it('hides the icon element from assistive technologies with aria-hidden', () => {
    render(<Badge icon="icon-sample">Solanáceas</Badge>);

    const iconElement = screen.getByText('icon-sample');

    expect(iconElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders children text as badge content', () => {
    render(<Badge>Solanáceas</Badge>);

    const badgeContent = screen.getByText('Solanáceas');

    expect(badgeContent).toBeInTheDocument();
  });
});
