import React, { useEffect } from 'react';
import { StellarExpertLink } from './StellarExpertLink';

export interface DisputeDetails {
  challengerWallet: string;
  reasonCode: number;
  reasonText: string;
  submittedAt: number;
  status: 'ACTIVE' | 'RESOLVED' | 'DISMISSED';
  resolutionNotes?: string;
}

export interface DisputeResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: string;
  dispute?: DisputeDetails;
  isAdmin?: boolean;
  onResolve?: () => void;
  onDismiss?: () => void;
}

export const DisputeResolutionModal: React.FC<DisputeResolutionModalProps> = ({
  isOpen,
  onClose,
  tournamentId,
  dispute = {
    challengerWallet: 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVWAC',
    reasonCode: 101,
    reasonText: 'Tick sequence desynchronization detected in final round',
    submittedAt: Date.now() - 3600000,
    status: 'ACTIVE',
  },
  isAdmin = false,
  onResolve,
  onDismiss,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getStatusBadge = () => {
    switch (dispute.status) {
      case 'RESOLVED':
        return { label: 'Dispute Resolved', bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981', color: '#34d399' };
      case 'DISMISSED':
        return { label: 'Challenge Dismissed', bg: 'rgba(107, 114, 128, 0.2)', border: '#6b7280', color: '#9ca3af' };
      case 'ACTIVE':
      default:
        return { label: 'Challenge Active', bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', color: '#f87171' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dispute-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(239, 68, 68, 0.15)',
          padding: '24px',
          color: '#ffffff',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <span
              style={{
                display: 'inline-block',
                padding: '3px 8px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: statusBadge.bg,
                border: `1px solid ${statusBadge.border}`,
                color: statusBadge.color,
                marginBottom: '6px',
              }}
            >
              {statusBadge.label}
            </span>
            <h2 id="dispute-modal-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
              {`Dispute Review: Tournament #${tournamentId}`}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dispute modal"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '8px',
              color: '#9ca3af',
              cursor: 'pointer',
              fontSize: '1.2rem',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            &times;
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>
              Challenger Address
            </span>
            <div style={{ marginTop: '4px' }}>
              <StellarExpertLink id={dispute.challengerWallet} type="account" />
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>
              {`Challenge Reason (Code: ${dispute.reasonCode})`}
            </span>
            <div style={{ fontSize: '0.85rem', color: '#fca5a5', marginTop: '4px', fontWeight: 500 }}>
              {dispute.reasonText}
            </div>
          </div>

          {dispute.resolutionNotes && (
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <span style={{ fontSize: '0.75rem', color: '#34d399', textTransform: 'uppercase' }}>
                Resolution Findings
              </span>
              <div style={{ fontSize: '0.85rem', color: '#d1fae5', marginTop: '4px' }}>
                {dispute.resolutionNotes}
              </div>
            </div>
          )}
        </div>

        {isAdmin && dispute.status === 'ACTIVE' && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            {onResolve && (
              <button
                type="button"
                onClick={onResolve}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Resolve &amp; Unlock Vault
              </button>
            )}

            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Dismiss Challenge
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
