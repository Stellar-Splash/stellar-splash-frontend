import React, { useState } from 'react';
import { stellarWalletAdapter } from '../services/stellar-wallet-adapter.service';
import { ConnectedWalletState, SupportedWalletType } from '../types/stellar-wallet-adapter';
import './WalletConnectModal.css';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnected: (state: ConnectedWalletState) => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  onWalletConnected,
}) => {
  const [connectingId, setConnectingId] = useState<SupportedWalletType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const providers = stellarWalletAdapter.getAvailableProviders();

  const handleSelect = async (providerId: SupportedWalletType) => {
    setConnectingId(providerId);
    setErrorMsg(null);
    try {
      const state = await stellarWalletAdapter.connect(providerId);
      onWalletConnected(state);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to connect wallet');
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <div className="wallet-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="wallet-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="wallet-modal-header">
          <div className="wallet-modal-title-group">
            <span className="stellar-logo-pill">Stellar Testnet</span>
            <h3>Connect Stellar Wallet</h3>
          </div>
          <button className="wallet-modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <p className="wallet-modal-subtitle">
          Select a wallet to participate in Soroban tournaments, sign prize agreements, and claim instant payouts.
        </p>

        {errorMsg && <div className="wallet-modal-error">{errorMsg}</div>}

        <div className="wallet-provider-list">
          {providers.map((p) => (
            <button
              key={p.id}
              className={`wallet-provider-btn ${p.id === 'sandbox' ? 'sandbox-provider' : ''}`}
              onClick={() => handleSelect(p.id)}
              disabled={connectingId !== null}
            >
              <span className="provider-icon">{p.icon}</span>
              <div className="provider-details">
                <div className="provider-name-row">
                  <span className="provider-name">{p.name}</span>
                  {p.id === 'sandbox' && <span className="badge-recommended">Judge Quickstart</span>}
                  {p.isInstalled && p.id !== 'sandbox' && (
                    <span className="badge-detected">Detected</span>
                  )}
                </div>
                <span className="provider-desc">{p.description}</span>
              </div>
              {connectingId === p.id && <span className="provider-spinner" />}
            </button>
          ))}
        </div>

        <div className="wallet-modal-footer">
          <span>Stellar Protocol 21 Ready &bull; Soroban Smart Contracts</span>
        </div>
      </div>
    </div>
  );
};

