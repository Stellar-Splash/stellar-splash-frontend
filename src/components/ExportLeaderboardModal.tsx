import React, { useState, useEffect } from 'react';

export interface LeaderboardExportRow {
  rank: number;
  playerWallet: string;
  score: number;
  accuracy: number;
  status: 'VERIFIED' | 'PENDING' | 'DISQUALIFIED';
  attestationHash?: string;
}

export interface ExportLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: string;
  tournamentTitle?: string;
  rows?: LeaderboardExportRow[];
  onExport?: (format: 'csv' | 'json') => void;
}

export const generateLeaderboardCsv = (rows: LeaderboardExportRow[]): string => {
  const headers = ['Rank', 'PlayerWallet', 'Score', 'AccuracyPct', 'Status', 'AttestationHash'];
  const csvLines = [headers.join(',')];

  rows.forEach((r) => {
    csvLines.push(
      [
        r.rank,
        r.playerWallet,
        r.score,
        r.accuracy.toFixed(1),
        r.status,
        r.attestationHash || '',
      ].join(',')
    );
  });

  return csvLines.join('\n');
};

export const ExportLeaderboardModal: React.FC<ExportLeaderboardModalProps> = ({
  isOpen,
  onClose,
  tournamentId,
  tournamentTitle = 'Championship Leaderboard',
  rows = [],
  onExport,
}) => {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (onExport) {
      onExport(format);
      return;
    }

    const content =
      format === 'csv'
        ? generateLeaderboardCsv(rows)
        : JSON.stringify(
            {
              tournamentId,
              exportedAt: new Date().toISOString(),
              totalParticipants: rows.length,
              standings: rows,
            },
            null,
            2
          );

    const blob = new Blob([content], {
      type: format === 'csv' ? 'text/csv' : 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tournament-${tournamentId}-standings.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyContent = () => {
    const content =
      format === 'csv' ? generateLeaderboardCsv(rows) : JSON.stringify(rows, null, 2);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Export Leaderboard Standings"
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        className="modal-card"
        style={{
          width: '90%',
          maxWidth: '520px',
          backgroundColor: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '1.5rem',
          color: '#f8fafc',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#38bdf8' }}>
            Export Tournament Standings
          </h3>
          <button
            onClick={onClose}
            aria-label="Close export modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '1.2rem',
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ margin: '0.75rem 0 1.25rem', fontSize: '0.9rem', color: '#94a3b8' }}>
          {`${tournamentTitle} (#${tournamentId}) • ${rows.length} participants`}
        </p>

        {/* Format Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>
            Export Format
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className={`btn-format ${format === 'csv' ? 'active' : ''}`}
              onClick={() => setFormat('csv')}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '6px',
                border: `1px solid ${format === 'csv' ? '#38bdf8' : '#334155'}`,
                backgroundColor: format === 'csv' ? 'rgba(56, 189, 248, 0.15)' : '#1e293b',
                color: format === 'csv' ? '#38bdf8' : '#cbd5e1',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              CSV Spreadsheet
            </button>
            <button
              type="button"
              className={`btn-format ${format === 'json' ? 'active' : ''}`}
              onClick={() => setFormat('json')}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '6px',
                border: `1px solid ${format === 'json' ? '#38bdf8' : '#334155'}`,
                backgroundColor: format === 'json' ? 'rgba(56, 189, 248, 0.15)' : '#1e293b',
                color: format === 'json' ? '#38bdf8' : '#cbd5e1',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              JSON Machine-Readable
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            type="button"
            className="btn-download"
            onClick={handleDownload}
            style={{
              flex: 2,
              padding: '0.6rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {`Download ${format.toUpperCase()}`}
          </button>
          <button
            type="button"
            className="btn-copy"
            onClick={handleCopyContent}
            style={{
              flex: 1,
              padding: '0.6rem 1rem',
              borderRadius: '6px',
              border: '1px solid #475569',
              backgroundColor: '#1e293b',
              color: '#cbd5e1',
              cursor: 'pointer',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};
