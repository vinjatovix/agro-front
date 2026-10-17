import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AdminDashboard from '../../../src/pages/admin/AdminDashboard';

describe('AdminDashboard page', () => {
  it('renders accessible admin heading icon', () => {
    render(<AdminDashboard />);

    const adminIcon = screen.getByRole('img', { name: 'Administración' });

    expect(adminIcon).toBeInTheDocument();
  });
});
