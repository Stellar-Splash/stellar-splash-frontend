import React, { useEffect, useState } from 'react';
import { X, Trophy, ShieldCheck, RefreshCw, Download } from 'lucide-react';
import { ApiClient, LeaderboardEntry, TournamentItem } from '../services/api';

export interface ExportDataPayload {
  tournamentId: number | string;
  tournamentName: string;
  exportedAt: string;
  totalParticipants: number;
  leaderboard: LeaderboardEntry[];
}

export function generateLeaderboardCSV(tournament: TournamentItem, leaderboard: LeaderboardEntry[]): string {
  const headers = [
    'Rank',
    'PlayerWallet',
    'CurrentScore',
    'MatchesPlayed',
    'VerificationStatus',
    'VerifiedScore',
    'ResultHash',
  ];

  const rows = leaderboard.map((entry) => [
    entry.rank,
    `"${entry.playerWallet}"`,
    entry.currentScore,
    entry.matchesPlayed,
    entry.finalVerifiedResult?.verified ? 'VERIFIED' : 'PENDING',
    entry.finalVerifiedResult?.score ?? '',
    entry.finalVerifiedResult?.resultHash ? `"${entry.finalVerifiedResult.resultHash}"` : '',
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function generateLeaderboardJSON(tournament: TournamentItem, leaderboard: LeaderboardEntry[]): ExportDataPayload {
  return {
    tournamentId: tournament.id,
    tournamentName: tournament.name,
    exportedAt: new Date().toISOString(),
    totalParticipants: leaderboard.length,
    leaderboard,
  };
}

export function triggerDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

interface LeaderboardModalProps {
  tournament: TournamentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  tournament,
  isOpen,
  onClose,
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && tournament) {
      loadData();
    }
  }, [isOpen, tournament]);

  const loadData = async () => {
    if (!tournament) return;
    setLoading(true);
    try {
      const data = await ApiClient.getLeaderboard(tournament.id);
      setLeaderboard(data.leaderboard);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!tournament) return;
    const csvContent = generateLeaderboardCSV(tournament, leaderboard);
    triggerDownload(csvContent, `tournament-${tournament.id}-leaderboard.csv`, 'text/csv;charset=utf-8;');
  };

  const handleExportJSON = () => {
    if (!tournament) return;
    const jsonPayload = generateLeaderboardJSON(tournament, leaderboard);
    triggerDownload(JSON.stringify(jsonPayload, null, 2), `tournament-${tournament.id}-leaderboard.json`, 'application/json');
  };

  if (!isOpen || !tournament) return null;

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
          maxWidth: '780px',
          padding: '32px',
          position: 'relative',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={22} style={{ color: 'var(--gold-glow)' }} />
            Tournament Leaderboard
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleExportCSV}
              disabled={leaderboard.length === 0}
              title="Export leaderboard as CSV"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '6px',
                padding: '6px 10px',
                color: 'var(--text-main)',
                cursor: leaderboard.length === 0 ? 'not-allowed' : 'pointer',
                opacity: leaderboard.length === 0 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <Download size={13} style={{ color: 'var(--cyan-glow)' }} /> CSV
            </button>
            <button
              onClick={handleExportJSON}
              disabled={leaderboard.length === 0}
              title="Export leaderboard telemetry as JSON"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '6px',
                padding: '6px 10px',
                color: 'var(--text-main)',
                cursor: leaderboard.length === 0 ? 'not-allowed' : 'pointer',
                opacity: leaderboard.length === 0 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <Download size={13} style={{ color: 'var(--gold-glow)' }} /> JSON
            </button>
            <button
              onClick={loadData}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--cyan-glow)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
              }}
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
            </button>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
          Leaderboard for <strong>{tournament.name}</strong>.
        </p>

        {/* Callout Notice: Current Score vs Final Verified Result */}
        <div
          style={{
            background: 'rgba(0, 240, 255, 0.05)',
            border: '1px solid rgba(0, 240, 255, 0.15)',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '16px',
            lineHeight: 1.4,
          }}
        >
          <strong style={{ color: 'var(--cyan-glow)' }}>Note on Verification:</strong> Current rankings reflect <strong>Current Score</strong> submissions. Final financial entitlement is governed by independently verified match attestations.
        </div>

        {/* Table */}
        <div style={{ overflowY: 'auto', flex: 1, border: '1px solid var(--border-glass)', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                <th style={{ padding: '12px', color: 'var(--text-dim)', fontWeight: 700 }}>RANK</th>
                <th style={{ padding: '12px', color: 'var(--text-dim)', fontWeight: 700 }}>PLAYER</th>
                <th style={{ padding: '12px', color: 'var(--text-dim)', fontWeight: 700 }}>CURRENT SCORE</th>
                <th style={{ padding: '12px', color: 'var(--text-dim)', fontWeight: 700 }}>MATCHES</th>
                <th style={{ padding: '12px', color: 'var(--text-dim)', fontWeight: 700 }}>VERIFIED RESULT</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr
                  key={entry.playerWallet}
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                >
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: entry.rank === 1 ? 'var(--gold-glow)' : 'var(--text-main)' }}>
                    #{entry.rank}
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {entry.shortWallet}
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--cyan-glow)' }}>
                    {entry.currentScore}
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>
                    {entry.matchesPlayed}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {entry.finalVerifiedResult ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: 'var(--emerald-glow)',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        <ShieldCheck size={14} /> Verified ({entry.finalVerifiedResult.score})
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dim)' }}>
                    No participant scores recorded yet. Be the first to play!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
