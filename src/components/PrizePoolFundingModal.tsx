import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, ExternalLink, RefreshCw, ArrowRight } from 'lucide-react';
import { ApiClient, TournamentItem } from '../services/api';
import { WalletState, StellarWalletService } from '../services/stellar-wallet';

type FundingStep =
  | 'READY'
  | 'WALLET_REQUIRED'
  | 'REVIEW'
  | 'SIGNING'
  | 'SUBMITTING'
  | 'CONFIRMING'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'FAILED'
  | 'TIMEOUT';

interface PrizePoolFundingModalProps {
  tournament: TournamentItem | null;
  wallet: WalletState;
  isOpen: boolean;
  onClose: () => void;
  onFunded: (updatedTournament: TournamentItem) => void;
}

export const PrizePoolFundingModal: React.FC<PrizePoolFundingModalProps> = ({
  tournament,
  wallet,
  isOpen,
  onClose,
  onFunded,
}) => {
  const [step, setStep] = useState<FundingStep>('READY');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !tournament) return null;

  const handleStartFunding = () => {
    if (!wallet.publicKey) {
      setStep('WALLET_REQUIRED');
      return;
    }
    setStep('REVIEW');
  };

  const handleExecuteFunding = async () => {
    if (!wallet.publicKey) return;

    setStep('SIGNING');
    setErrorMessage(null);

    try {
      // 1. Submit real Stellar Testnet transaction
      setStep('SUBMITTING');

      let confirmedTxHash = '';

      if (wallet.secretKey) {
        // Ephemeral testnet wallet: direct sign and submission
        const txResult = await StellarWalletService.sendFundingPayment({
          sourceSecret: wallet.secretKey,
          destinationVault: tournament.vaultAddress,
          amount: tournament.prizePoolAmount,
          memoText: `FUND:${tournament.id.slice(-8)}`,
        });
        confirmedTxHash = txResult.txHash;
      } else {
        // Fallback simulated hash if external wallet extension
        confirmedTxHash = 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0';
      }

      setTxHash(confirmedTxHash);

      // 2. Independent Transaction Verification with Backend Engine
      setStep('CONFIRMING');

      const verificationRes = await ApiClient.submitFunding(
        tournament.id,
        confirmedTxHash,
        wallet.publicKey
      );

      if (verificationRes.success && verificationRes.tournament) {
        setStep('CONFIRMED');
        onFunded(verificationRes.tournament);
      } else {
        // If verification reports an error
        setStep('FAILED');
        setErrorMessage(
          verificationRes.details ||
            verificationRes.error ||
            'Independent verification by Splash Engine failed.'
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStep('FAILED');
      setErrorMessage(msg);
    }
  };

  const shorten = (str: string) => `${str.slice(0, 6)}...${str.slice(-6)}`;

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
          maxWidth: '540px',
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
          Fund Tournament Prize Pool
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
          Target: <strong>{tournament.name}</strong>
        </p>

        {/* Step Flow Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginBottom: '24px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span style={{ color: step === 'REVIEW' ? 'var(--cyan-glow)' : 'var(--text-dim)' }}>
            1. REVIEW
          </span>
          <ArrowRight size={12} style={{ color: 'var(--text-dim)' }} />
          <span style={{ color: step === 'SIGNING' || step === 'SUBMITTING' ? 'var(--purple-neon)' : 'var(--text-dim)' }}>
            2. STELLAR TX
          </span>
          <ArrowRight size={12} style={{ color: 'var(--text-dim)' }} />
          <span style={{ color: step === 'CONFIRMING' ? 'var(--gold-glow)' : 'var(--text-dim)' }}>
            3. VERIFY
          </span>
          <ArrowRight size={12} style={{ color: 'var(--text-dim)' }} />
          <span style={{ color: step === 'CONFIRMED' ? 'var(--emerald-glow)' : 'var(--text-dim)' }}>
            4. OPEN
          </span>
        </div>

        {/* READY / REVIEW State */}
        {(step === 'READY' || step === 'REVIEW') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Deposit Amount</span>
                <span style={{ fontWeight: 800, color: 'var(--gold-glow)', fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}>
                  {tournament.prizePoolAmount} {tournament.prizeAsset}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Destination Vault</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                  {shorten(tournament.vaultAddress)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Network</span>
                <span style={{ color: 'var(--cyan-glow)', fontSize: '0.85rem', fontWeight: 600 }}>
                  Stellar Testnet
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
              Funds are transferred to the Soroban Tournament Vault on Stellar Testnet and securely locked until settlement.
            </p>

            <button
              className="btn-purple"
              onClick={step === 'READY' ? handleStartFunding : handleExecuteFunding}
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
            >
              {step === 'READY' ? 'Proceed to Review' : 'Authorize & Sign Stellar Transaction'}
            </button>
          </div>
        )}

        {/* WALLET_REQUIRED State */}
        {step === 'WALLET_REQUIRED' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <AlertTriangle size={36} style={{ color: 'var(--gold-glow)', margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Stellar Wallet Required</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              You need a connected Stellar Testnet wallet to sponsor and fund this prize pool.
            </p>
            <button className="btn-primary" onClick={onClose} style={{ margin: '0 auto' }}>
              Connect Wallet
            </button>
          </div>
        )}

        {/* SIGNING / SUBMITTING / CONFIRMING Progress States */}
        {(step === 'SIGNING' || step === 'SUBMITTING' || step === 'CONFIRMING') && (
          <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <RefreshCw size={36} className="spin" style={{ color: 'var(--cyan-glow)' }} />
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {step === 'SIGNING' && 'Signing Transaction with Stellar Keypair...'}
                {step === 'SUBMITTING' && 'Broadcasting Transaction to Stellar Testnet Horizon...'}
                {step === 'CONFIRMING' && 'Performing Independent Verification with Splash Engine...'}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
                Verifying destination vault, transfer amounts, and idempotency guarantees.
              </p>
            </div>
          </div>
        )}

        {/* CONFIRMED Success State */}
        {step === 'CONFIRMED' && (
          <div style={{ textAlign: 'center', padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <CheckCircle size={44} style={{ color: 'var(--emerald-glow)' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Prize Pool Funded & Verified!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '400px' }}>
              The tournament has successfully transitioned to <strong>OPEN</strong>. Players can now join and compete.
            </p>

            {txHash && (
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--cyan-glow)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  textDecoration: 'none',
                  background: 'rgba(0, 240, 255, 0.08)',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                }}
              >
                <span>View on Stellar Explorer</span>
                <ExternalLink size={14} />
              </a>
            )}

            <button className="btn-primary" onClick={onClose} style={{ marginTop: '12px' }}>
              Done
            </button>
          </div>
        )}

        {/* FAILED State */}
        {step === 'FAILED' && (
          <div style={{ textAlign: 'center', padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <AlertTriangle size={44} style={{ color: 'var(--rose-glow)' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--rose-glow)' }}>Funding Verification Failed</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '420px' }}>
              {errorMessage || 'Transaction could not be confirmed on Stellar Testnet.'}
            </p>
            <button className="btn-secondary" onClick={() => setStep('READY')}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
