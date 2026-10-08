import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, Info } from 'lucide-react';
import { ApiClient, TournamentItem } from '../services/api';
import { WalletState } from '../services/stellar-wallet';

interface CreateTournamentModalProps {
  wallet: WalletState;
  isOpen: boolean;
  onClose: () => void;
  onCreated: (t: TournamentItem) => void;
}

export const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({
  wallet,
  isOpen,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prizeAsset, setPrizeAsset] = useState<'XLM' | 'USDC'>('USDC');
  const [prizePoolAmount, setPrizePoolAmount] = useState<number>(50);
  const [maxParticipants, setMaxParticipants] = useState<number>(16);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey) {
      setError('Please connect your Stellar wallet first to authorize tournament creation.');
      return;
    }

    setLoading(true);
    setError(null);

    const now = Date.now();
    const startTime = now;
    const endTime = now + 86400 * 1000 * 7; // 7 days

    const res = await ApiClient.createTournament({
      name,
      description,
      creatorWallet: wallet.publicKey,
      prizeAsset,
      prizePoolAmount: Number(prizePoolAmount),
      maxParticipants: Number(maxParticipants),
      startTime,
      endTime,
    });

    setLoading(false);

    if (res.success && res.tournament) {
      onCreated(res.tournament);
      onClose();
    } else {
      setError(res.error || 'Failed to initialize tournament.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(5, 8, 17, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '32px',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>
          Create Tournament
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
          Configure tournament parameters. Prize pool funding on Stellar Testnet occurs in the next step.
        </p>

        {/* Warning callout: Configuration vs Funding */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
            background: 'rgba(255, 184, 0, 0.08)',
            border: '1px solid rgba(255, 184, 0, 0.25)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: '#fbbf24',
            marginBottom: '20px',
          }}
        >
          <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Tournament Configuration vs Funding:</strong> Creating a tournament initializes the record in <strong>FUNDING</strong> state. The prize pool must be funded on Stellar Testnet before players can join.
          </div>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: 'var(--rose-glow)',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Tournament Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cyber Rush Championship #002"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-main)',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Description & Rules
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide tournament details, skill guidelines, and objectives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-main)',
                fontSize: '0.9rem',
                resize: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Prize Asset
              </label>
              <select
                value={prizeAsset}
                onChange={(e) => setPrizeAsset(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(14, 22, 43, 0.95)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-main)',
                  fontSize: '0.9rem',
                }}
              >
                <option value="USDC">USDC (Testnet)</option>
                <option value="XLM">XLM (Native Testnet)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Prize Pool Amount
              </label>
              <input
                type="number"
                min={1}
                required
                value={prizePoolAmount}
                onChange={(e) => setPrizePoolAmount(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Maximum Players
            </label>
            <input
              type="number"
              min={2}
              max={512}
              required
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-purple" disabled={loading}>
              <PlusCircle size={16} />
              {loading ? 'Initializing...' : 'Create Tournament'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
