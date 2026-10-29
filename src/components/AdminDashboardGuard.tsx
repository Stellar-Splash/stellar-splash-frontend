import React from 'react';

export interface AdminDashboardGuardProps {
  connectedWallet?: string;
  adminWallets?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const DEFAULT_ADMIN_WALLETS = [
  'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB',
  'GB7B2W55CDAF7KAZQ7QD3W577G5C2WCK73X42O4WJ4P7G7D8',
];

export const AdminDashboardGuard: React.FC<AdminDashboardGuardProps> = ({
  connectedWallet,
  adminWallets = DEFAULT_ADMIN_WALLETS,
  children,
  fallback,
}) => {
  const isAuthorized =
    Boolean(connectedWallet) &&
    adminWallets.some(
      (admin) => admin.toLowerCase() === connectedWallet?.toLowerCase()
    );

  if (!isAuthorized) {
    if (fallback) return <>{fallback}</>;

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="admin-guard-unauthorized"
        style={{
          padding: '2rem',
          maxWidth: '560px',
          margin: '2rem auto',
          backgroundColor: '#0f172a',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          color: '#f8fafc',
          textAlign: 'center',
          boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.2)',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🛡️</div>
        <h3 style={{ margin: '0 0 0.5rem', color: '#f87171', fontSize: '1.25rem' }}>
          Administrative Access Required
        </h3>
        <p style={{ margin: '0 0 1.25rem', color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
          {connectedWallet
            ? `Connected wallet (${connectedWallet.slice(0, 6)}...${connectedWallet.slice(-4)}) is not authorized for protocol governance.`
            : 'No Freighter wallet connected. Please connect an authorized administrative wallet.'}
        </p>
        <div
          style={{
            display: 'inline-block',
            padding: '0.4rem 0.8rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '6px',
            fontSize: '0.8rem',
            color: '#fca5a5',
            fontFamily: 'monospace',
          }}
        >
          Requires: Contract Admin / Multi-Sig Signer
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-wrapper">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 1rem',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
          fontSize: '0.8rem',
          color: '#38bdf8',
          fontFamily: 'monospace',
        }}
      >
        <span>⚡ Admin Governance Mode Active</span>
        <span>{`Wallet: ${connectedWallet?.slice(0, 6)}...${connectedWallet?.slice(-4)}`}</span>
      </div>
      {children}
    </div>
  );
};
