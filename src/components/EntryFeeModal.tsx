import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, ArrowRight, Coins, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';
import { ToastService } from '../services/toast';

export interface EntryFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: string;
  tournamentTitle: string;
  entryFee: number;
  assetSymbol?: string;
  playerBalance?: number;
  playerWalletAddress?: string;
  onSuccess?: (txHash: string) => void;
}

export type PaymentStep = 'REVIEW' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export const EntryFeeModal: React.FC<EntryFeeModalProps> = ({
  isOpen,
  onClose,
  tournamentId,
  tournamentTitle,
  entryFee,
  assetSymbol = 'XLM',
  playerBalance = 50.0,
  playerWalletAddress,
  onSuccess,
}) => {
  const [step, setStep] = useState<PaymentStep>('REVIEW');
  const [statusText, setStatusText] = useState<string>('Ready for signature');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const estimatedFeeStroops = 100;
  const estimatedFeeXlm = estimatedFeeStroops / 10_000_000;
  const totalRequired = entryFee + (assetSymbol === 'XLM' ? estimatedFeeXlm : 0);
  const hasSufficientBalance = playerBalance >= totalRequired;

  const handlePayEntryFee = async () => {
    if (!hasSufficientBalance) {
      setErrorMsg(`Insufficient ${assetSymbol} balance to cover entry fee and gas.`);
      return;
    }

    setStep('PROCESSING');
    setErrorMsg(null);
    setStatusText('Simulating Soroban transaction footprint...');

    try {
      // Simulate footprint delay
      await new Promise((r) => setTimeout(r, 600));
      setStatusText('Requesting Freighter wallet signature...');

      await new Promise((r) => setTimeout(r, 800));
      setStatusText('Submitting entry fee escrow transfer to Stellar Testnet...');

      const mockHash = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      await new Promise((r) => setTimeout(r, 800));

      setTxHash(mockHash);
      setStep('SUCCESS');
      ToastService.success('Entry Fee Paid', `Successfully registered for ${tournamentTitle}`, mockHash);

      if (onSuccess) {
        onSuccess(mockHash);
      }
    } catch (err: any) {
      setStep('FAILED');
      setErrorMsg(err?.message || 'Transaction rejected by user or network timeout.');
      ToastService.error('Payment Failed', err?.message || 'Failed to pay entry fee.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      data-testid="entry-fee-modal"
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(10, 16, 34, 0.95)',
          border: '1px solid var(--border-glass)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
          color: 'var(--text-main)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Coins size={20} color="var(--cyan-glow)" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Tournament Entry Escrow</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        {step === 'REVIEW' && (
          <div>
            <div
              style={{
                background: 'rgba(0, 240, 255, 0.05)',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Tournament</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>{tournamentTitle}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>ID: {tournamentId}</div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '0.85rem',
                marginBottom: '18px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Entry Fee</span>
                <span style={{ fontWeight: 600, color: 'var(--cyan-glow)' }}>
                  {`${entryFee} ${assetSymbol}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Network Fee (Simulated)</span>
                <span style={{ color: 'var(--text-muted)' }}>{`~${estimatedFeeStroops} Stroops`}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Your Available Balance</span>
                <span style={{ fontWeight: 600, color: hasSufficientBalance ? 'var(--emerald-glow)' : 'var(--rose-glow)' }}>
                  {`${playerBalance.toFixed(2)} ${assetSymbol}`}
                </span>
              </div>
            </div>

            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--rose-glow)',
                  fontSize: '0.82rem',
                  marginBottom: '16px',
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handlePayEntryFee}
              disabled={!hasSufficientBalance}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: hasSufficientBalance
                  ? 'linear-gradient(135deg, var(--cyan-glow), var(--purple-glow))'
                  : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: hasSufficientBalance ? '#000' : 'var(--text-dim)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: hasSufficientBalance ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>Approve & Deposit Entry Fee</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 'PROCESSING' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <Loader2 size={36} color="var(--cyan-glow)" className="animate-spin" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ margin: '0 0 8px', fontSize: '1rem' }}>Processing Escrow Transfer</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>{statusText}</p>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CheckCircle2 size={40} color="var(--emerald-glow)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', color: 'var(--emerald-glow)' }}>Registration Confirmed!</h4>
            <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Your entry fee of {entryFee} {assetSymbol} is locked in the tournament vault escrow.
            </p>
            {txHash && (
              <div
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontFamily: 'monospace',
                  marginBottom: '20px',
                  wordBreak: 'break-all',
                }}
              >
                Tx: {txHash}
              </div>
            )}
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-main)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Enter Tournament Arena
            </button>
          </div>
        )}

        {step === 'FAILED' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <AlertCircle size={40} color="var(--rose-glow)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', color: 'var(--rose-glow)' }}>Payment Rejected</h4>
            <p style={{ margin: '0 0 20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{errorMsg}</p>
            <button
              onClick={() => setStep('REVIEW')}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-main)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
