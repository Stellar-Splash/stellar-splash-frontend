import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  AdminDashboardGuard,
  DEFAULT_ADMIN_WALLETS,
} from '../components/AdminDashboardGuard';

describe('AdminDashboardGuard Component', () => {
  it('renders children with admin active badge when connected wallet is authorized', () => {
    const adminWallet = DEFAULT_ADMIN_WALLETS[0];
    const html = renderToString(
      <AdminDashboardGuard connectedWallet={adminWallet}>
        <div data-testid="admin-panel">Admin Controls Content</div>
      </AdminDashboardGuard>
    );

    expect(html).toContain('admin-dashboard-wrapper');
    expect(html).toContain('⚡ Admin Governance Mode Active');
    expect(html).toContain('Admin Controls Content');
    expect(html).not.toContain('Administrative Access Required');
  });

  it('renders unauthorized alert when wallet is not an admin', () => {
    const html = renderToString(
      <AdminDashboardGuard connectedWallet="GA_RANDOM_USER_WALLET_12345">
        <div>Restricted Content</div>
      </AdminDashboardGuard>
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain('Administrative Access Required');
    expect(html).toContain('not authorized for protocol governance');
    expect(html).not.toContain('Restricted Content');
  });

  it('renders unauthorized alert when no wallet is connected', () => {
    const html = renderToString(
      <AdminDashboardGuard>
        <div>Restricted Content</div>
      </AdminDashboardGuard>
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain('No Freighter wallet connected');
    expect(html).not.toContain('Restricted Content');
  });

  it('renders custom fallback when provided for unauthorized user', () => {
    const html = renderToString(
      <AdminDashboardGuard fallback={<div id="custom-fallback">Custom Access Denied</div>}>
        <div>Restricted Content</div>
      </AdminDashboardGuard>
    );

    expect(html).toContain('Custom Access Denied');
    expect(html).not.toContain('Restricted Content');
  });
});
