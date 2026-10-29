import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check, Twitter, Send, X, QrCode } from 'lucide-react';

export interface TournamentShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: number | string;
  tournamentTitle: string;
  prizePoolAmount: number | string;
  prizeTokenSymbol?: string;
  shareBaseUrl?: string;
}

export const TournamentShareModal: React.FC<TournamentShareModalProps> = ({
  isOpen,
  onClose,
  tournamentId,
  tournamentTitle,
  prizePoolAmount,
  prizeTokenSymbol = 'XLM',
  shareBaseUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      setCanNativeShare(true);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const baseUrl =
    shareBaseUrl ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://stellarsplash.game');
  const shareUrl = `${baseUrl}?tournament=${tournamentId}`;
  const shareText = `Compete in ${tournamentTitle} on Stellar Splash! Prize pool: ${prizePoolAmount} ${prizeTokenSymbol} powered by Soroban on Stellar.`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (canNativeShare) {
      try {
        await navigator.share({
          title: `Stellar Splash - ${tournamentTitle}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    }
  };

  const twitterIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText,
  )}&url=${encodeURIComponent(shareUrl)}&hashtags=Stellar,Soroban,Gaming`;

  const telegramIntent = `https://t.me/share/url?url=${encodeURIComponent(
    shareUrl,
  )}&text=${encodeURIComponent(shareText)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      data-testid="tournament-share-modal"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#0f172a',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '460px',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.1)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <Share2 size={20} />
            </div>
            <div>
              <h3
                id="share-modal-title"
                style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc' }}
              >
                Share Tournament
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                Invite players to compete on Stellar Testnet
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            data-testid="share-modal-close-button"
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tournament Highlights Card */}
        <div
          style={{
            backgroundColor: '#1e293b',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#e2e8f0' }}>
            {tournamentTitle}
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#38bdf8', marginTop: '4px' }}>
            Prize Pool: <strong>{prizePoolAmount} {prizeTokenSymbol}</strong>
          </div>
        </div>

        {/* Share Link Input with Copy Button */}
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="share-url-input"
            style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}
          >
            Direct Tournament Link
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              id="share-url-input"
              type="text"
              readOnly
              value={shareUrl}
              data-testid="share-url-input"
              style={{
                flex: 1,
                backgroundColor: '#020617',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#cbd5e1',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={handleCopy}
              data-testid="share-copy-button"
              style={{
                backgroundColor: copied ? '#059669' : '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0 14px',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.15s ease',
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <a
            href={twitterIntent}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="share-twitter-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: '#1d9bf0',
              color: '#ffffff',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <Twitter size={16} />
            Post on X
          </a>
          <a
            href={telegramIntent}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="share-telegram-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: '#229ed9',
              color: '#ffffff',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <Send size={16} />
            Telegram
          </a>
        </div>

        {/* Web Share API Button if available */}
        {canNativeShare && (
          <button
            type="button"
            onClick={handleNativeShare}
            data-testid="share-native-button"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.875rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Share2 size={16} />
            More Share Options
          </button>
        )}
      </div>
    </div>
  );
};
