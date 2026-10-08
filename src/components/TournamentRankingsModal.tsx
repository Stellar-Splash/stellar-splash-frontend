import React, { useState, useEffect } from 'react';
import { ApiClient, FinalRankingRecord } from '../services/api';

interface TournamentRankingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId?: string;
  tournamentName?: string;
  creatorWallet?: string;
  onOpenSettlement?: () => void;
}

export const TournamentRankingsModal: React.FC<TournamentRankingsModalProps> = ({
  isOpen,
  onClose,
  tournamentId = 'tourn-splash-001',
  tournamentName = 'Splash Rush Genesis Cup',
  creatorWallet = 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB',
  onOpenSettlement,
}) => {
  const [rankingRecord, setRankingRecord] = useState<FinalRankingRecord | null>(null);
  const [isFinalized, setIsFinalized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [finalizing, setFinalizing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadRankings();
    }
  }, [isOpen, tournamentId]);

  const loadRankings = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.getTournamentRanking(tournamentId);
      if (res.ranking) {
        setRankingRecord(res.ranking);
        setIsFinalized(res.finalized);
      }
    } catch (err) {
      console.error('Failed to load rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    setFinalizing(true);
    setMessage(null);
    try {
      const res = await ApiClient.finalizeTournamentRanking(tournamentId, creatorWallet);
      if (res.success && res.ranking) {
        setRankingRecord(res.ranking);
        setIsFinalized(true);
        setMessage({
          type: 'success',
          text: 'Tournament rankings finalized! Canonical ranking hash has been locked.',
        });
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to finalize rankings' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: String(err) });
    } finally {
      setFinalizing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="badge gold">FINAL STANDINGS</div>
            <h2>Verified Tournament Rankings</h2>
            <p className="subtitle">
              Calculated deterministically from independently verified match records. Unverified scores are strictly excluded.
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {message && <div className={`alert-${message.type}`}>{message.text}</div>}

          {/* Status Header */}
          <div className="rankings-header-card">
            <div>
              <span className="tourn-label">{tournamentName}</span>
              <div className="tie-breaker-notice">
                <span>Deterministic Tie Rules: <strong>Score</strong> &rarr; <strong>Accuracy</strong> &rarr; <strong>Earliest Finish</strong></span>
              </div>
            </div>
            <div className={`status-badge-lg ${isFinalized ? 'finalized' : 'preview'}`}>
              {isFinalized ? '🔒 RANKINGS FINALIZED' : '⚡ VERIFIED PREVIEW'}
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading verified rankings...</div>
          ) : (
            <>
              {/* Standings Table */}
              <div className="rankings-table-container">
                <table className="rankings-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player Wallet</th>
                      <th>Verified Score</th>
                      <th>Accuracy</th>
                      <th>Match ID</th>
                      <th>Verification Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankingRecord?.entries.map((entry) => (
                      <tr key={entry.rank} className={`rank-row rank-${entry.rank}`}>
                        <td>
                          <span className="rank-num">
                            {entry.rank === 1 ? '🥇 1' : entry.rank === 2 ? '🥈 2' : entry.rank === 3 ? '🥉 3' : entry.rank}
                          </span>
                        </td>
                        <td>
                          <code className="wallet-code">
                            {entry.playerWallet.slice(0, 8)}...{entry.playerWallet.slice(-6)}
                          </code>
                        </td>
                        <td>
                          <span className="score-val">{entry.score.toLocaleString()}</span>
                        </td>
                        <td>
                          <span className="accuracy-val">{entry.accuracy}%</span>
                        </td>
                        <td>
                          <code className="match-code">{entry.matchId}</code>
                        </td>
                        <td>
                          <span className="status-pill verified">✓ VERIFIED</span>
                        </td>
                      </tr>
                    ))}
                    {(!rankingRecord?.entries || rankingRecord.entries.length === 0) && (
                      <tr>
                        <td colSpan={6} className="empty-row">
                          No verified match results found yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Cryptographic Ranking Hash Box */}
              {rankingRecord && (
                <div className="ranking-hash-card">
                  <span className="hash-title">Canonical Ranking Hash (SHA-256):</span>
                  <div className="hash-box">
                    <code>{rankingRecord.rankingHash}</code>
                  </div>
                  <p className="hash-desc">
                    Deterministic prize settlement will consume this exact ranking hash. Any alteration to results or positions produces a different hash.
                  </p>
                </div>
              )}

              {/* Finalization Action Row */}
              <div className="rankings-actions-row" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {!isFinalized ? (
                  <button
                    className="btn-primary glow"
                    onClick={handleFinalize}
                    disabled={finalizing || !rankingRecord?.entries.length}
                  >
                    {finalizing ? 'Finalizing...' : '🏆 Finalize Tournament Standings'}
                  </button>
                ) : (
                  <div className="finalized-confirmation" style={{ display: 'flex', gap: '16px', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <span>✓ Standings finalized by <code>{rankingRecord?.finalizedBy}</code></span>
                    {onOpenSettlement && (
                      <button
                        className="btn-primary"
                        onClick={() => {
                          onClose();
                          onOpenSettlement();
                        }}
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        ⚖️ Proceed to Settlement →
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
