import React from 'react';
import { Download, FileCheck } from 'lucide-react';
import { ToastService } from '../services/toast';

export interface ReplayPayload {
  version: string;
  matchId: string;
  tournamentId: string;
  player: string;
  score: number;
  seed: string;
  durationMs: number;
  signature: string;
  ticks: Array<{ tick: number; x: number; y: number; t: number; type: string }>;
  exportedAt: number;
}

export interface ReplayExportButtonProps {
  matchData: Omit<ReplayPayload, 'version' | 'exportedAt'>;
  label?: string;
  className?: string;
}

export const ReplayExportButton: React.FC<ReplayExportButtonProps> = ({
  matchData,
  label = 'Export Replay Proof (.json)',
  className = '',
}) => {
  const handleExport = () => {
    const bundle: ReplayPayload = {
      version: '1.0.0',
      ...matchData,
      exportedAt: Date.now(),
    };

    const fileName = `${matchData.matchId}.splashreplay.json`;
    const serialized = JSON.stringify(bundle, null, 2);

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        const blob = new Blob([serialized], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        ToastService.info(
          'Replay Proof Exported',
          `Saved ${fileName} with cryptographic signature.`
        );
      } catch (err) {
        console.error('Failed to export replay proof', err);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className={`replay-export-btn ${className}`}
      data-testid="replay-export-button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        borderRadius: '8px',
        background: 'rgba(0, 240, 255, 0.08)',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        color: 'var(--cyan-glow, #00F0FF)',
        fontSize: '0.82rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      title={`Download verifiable cryptographic match replay for ${matchData.matchId}`}
    >
      <Download size={14} />
      <span>{label}</span>
    </button>
  );
};
