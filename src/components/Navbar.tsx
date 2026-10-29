import React, { useState } from 'react';
import { Wallet, Globe, LogOut, RefreshCw, Key } from 'lucide-react';
import { WalletState, StellarWalletService } from '../services/stellar-wallet';
import { AudioSettingsControl } from './AudioSettingsControl';

interface NavbarProps {
  wallet: WalletState;
  onWalletChange: (w: WalletState) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenPayoutHistory?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  wallet,
  onWalletChange,
  activeTab,
  onTabChange,
  onOpenPayoutHistory,
}) => {
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleConnectFreighter = async () => {
    setLoading(true);
    try {
      const newWallet = await StellarWalletService.connectFreighter();
      onWalletChange(newWallet);
    } catch (err: any) {
      alert(err.message || 'Could not connect to Freighter wallet.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectEphemeral = async () => {
    setLoading(true);
    try {
      const newWallet = await StellarWalletService.createAndFundTestnetWallet();
      onWalletChange(newWallet);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    StellarWalletService.disconnect();
    onWalletChange({
      address: null,
      publicKey: null,
      status: 'DISCONNECTED',
      network: 'Stellar Testnet',
      balanceXLM: 0,
      walletType: 'FREIGHTER',
      isEphemeral: false,
    });
    setShowDropdown(false);
  };

  const handleRefreshBalance = async () => {
    if (!wallet.publicKey) return;
    setLoading(true);
    try {
      const bal = await StellarWalletService.refreshBalance(wallet.publicKey);
      onWalletChange({ ...wallet, balanceXLM: bal });
    } finally {
      setLoading(false);
    }
  };

  const shorten = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(5, 8, 17, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-glass)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div
          onClick={() => onTabChange('tournaments')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '1.8rem' }}>🌊</span>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #00f0ff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              STELLAR SPLASH
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Verifiable Gaming
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'tournaments', label: 'Tournaments' },
            { id: 'play', label: 'Play Splash Rush' },
            { id: 'how', label: 'How It Works' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                background: activeTab === tab.id ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                color: activeTab === tab.id ? 'var(--cyan-glow)' : 'var(--text-muted)',
                border: activeTab === tab.id ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid transparent',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Network & Wallet Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Audio Volume & Mute Control */}
        <AudioSettingsControl />

        {/* Network Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 240, 255, 0.08)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            color: 'var(--cyan-glow)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <Globe size={14} />
          <span>Stellar Testnet</span>
        </div>

        {/* My Payouts Button */}
        {wallet.status === 'CONNECTED' && wallet.publicKey && onOpenPayoutHistory && (
          <button
            className="btn-secondary"
            onClick={onOpenPayoutHistory}
            style={{ padding: '8px 14px', fontSize: '0.85rem', borderColor: 'rgba(99, 102, 241, 0.4)', color: '#818cf8' }}
            title="View Player Payout History & Receipts"
          >
            <span>🏆 My Payouts</span>
          </button>
        )}

        {/* Wallet Button */}
        {wallet.status === 'CONNECTED' && wallet.publicKey ? (
          <div style={{ position: 'relative' }}>
            <button
              className="btn-secondary"
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ padding: '8px 16px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}
            >
              <Wallet size={16} style={{ color: 'var(--cyan-glow)' }} />
              <span>{shorten(wallet.publicKey)}</span>
              <span style={{ color: 'var(--gold-glow)', marginLeft: '4px' }}>
                ({wallet.balanceXLM.toFixed(1)} XLM)
              </span>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                  padding: '16px',
                  width: '280px',
                  zIndex: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Connected Wallet</span>
                  <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-main)', wordBreak: 'break-all', marginTop: '4px' }}>
                    {wallet.publicKey}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Balance</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-glow)', fontFamily: 'var(--font-mono)' }}>
                    {wallet.balanceXLM.toFixed(2)} XLM
                  </span>
                </div>

                <button
                  onClick={handleRefreshBalance}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--cyan-glow)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    padding: '4px 0',
                  }}
                >
                  <RefreshCw size={14} /> Refresh Balance
                </button>

                <button
                  onClick={handleDisconnect}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    color: 'var(--rose-glow)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '4px',
                  }}
                >
                  <LogOut size={14} /> Disconnect
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              className="btn-primary"
              onClick={handleConnectFreighter}
              disabled={loading}
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              title="Connect standard non-custodial Freighter browser extension"
            >
              {loading ? <RefreshCw size={16} className="spin" /> : <Wallet size={16} />}
              Connect Freighter
            </button>
            <button
              className="btn-secondary"
              onClick={handleConnectEphemeral}
              disabled={loading}
              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              title="Instant Friendbot-funded testnet keypair for demo and testing"
            >
              <Key size={14} /> Quick Demo Wallet
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
