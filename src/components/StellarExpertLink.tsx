import React, { useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import {
  buildExplorerTxUrl,
  buildExplorerAccountUrl,
  buildExplorerContractUrl,
} from '../constants/stellar';

export type ExplorerLinkType = 'tx' | 'account' | 'contract';

export interface StellarExpertLinkProps {
  type: ExplorerLinkType;
  id: string;
  label?: string;
  showCopy?: boolean;
  shorten?: boolean;
  className?: string;
}

export const StellarExpertLink: React.FC<StellarExpertLinkProps> = ({
  type,
  id,
  label,
  showCopy = true,
  shorten = true,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const getUrl = (): string => {
    switch (type) {
      case 'tx':
        return buildExplorerTxUrl(id);
      case 'account':
        return buildExplorerAccountUrl(id);
      case 'contract':
        return buildExplorerContractUrl(id);
      default:
        return `https://stellar.expert/explorer/testnet/search?term=${id}`;
    }
  };

  const displayText =
    label ||
    (shorten && id.length > 12 ? `${id.slice(0, 6)}...${id.slice(-6)}` : id);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Clipboard write failed or blocked
    }
  };

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.85rem',
        fontFamily: 'var(--font-mono)',
      }}
      data-testid="stellar-expert-link-container"
    >
      <a
        href={getUrl()}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--cyan-glow)',
          textDecoration: 'none',
          transition: 'color 0.2s ease',
        }}
        title={`View ${type} on Stellar Expert Testnet Explorer`}
      >
        <span>{displayText}</span>
        <ExternalLink size={12} style={{ opacity: 0.8 }} />
      </a>

      {showCopy && (
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : `Copy ${type} ID`}
          title={copied ? 'Copied to clipboard!' : `Copy ${id}`}
          style={{
            background: copied ? 'rgba(0, 255, 163, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${copied ? 'rgba(0, 255, 163, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: '4px',
            color: copied ? 'var(--emerald-glow)' : 'var(--text-dim)',
            padding: '2px 4px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      )}
    </span>
  );
};
