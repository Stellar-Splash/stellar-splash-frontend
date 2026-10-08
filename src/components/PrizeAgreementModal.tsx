import React, { useState, useEffect } from 'react';
import { ApiClient, PrizeAgreement, AllocationRule } from '../services/api';

interface PrizeAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId?: string;
  tournamentName?: string;
  creatorWallet?: string;
  prizePoolAmount?: number;
  prizeAsset?: string;
}

export const PrizeAgreementModal: React.FC<PrizeAgreementModalProps> = ({
  isOpen,
  onClose,
  tournamentId = 'tourn-splash-001',
  tournamentName = 'Splash Rush Genesis Cup',
  creatorWallet = 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB',
  prizePoolAmount = 100,
  prizeAsset = 'USDC',
}) => {
  const [agreements, setAgreements] = useState<PrizeAgreement[]>([]);
  const [activeAgreement, setActiveAgreement] = useState<PrizeAgreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New version creation state
  const [showCreateVersion, setShowCreateVersion] = useState(false);
  const [rank1Bps, setRank1Bps] = useState(5000);
  const [rank2Bps, setRank2Bps] = useState(3000);
  const [rank3Bps, setRank3Bps] = useState(2000);

  useEffect(() => {
    if (isOpen) {
      loadAgreements();
    }
  }, [isOpen, tournamentId]);

  const loadAgreements = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.getTournamentAgreements(tournamentId);
      if (res.agreements && res.agreements.length > 0) {
        setAgreements(res.agreements);
        // Find locked or highest version
        const locked = res.agreements.find((a) => a.status === 'LOCKED');
        setActiveAgreement(locked || res.agreements[res.agreements.length - 1]);
      }
    } catch (err) {
      console.error('Failed to load agreements:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalBps = Number(rank1Bps) + Number(rank2Bps) + Number(rank3Bps);

  const handleApprove = async () => {
    if (!activeAgreement) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await ApiClient.approveAgreement(tournamentId, activeAgreement.version, creatorWallet);
      if (res.success && res.agreement) {
        setMessage({ type: 'success', text: `Agreement v${res.agreement.version} approved by wallet.` });
        await loadAgreements();
      } else {
        setMessage({ type: 'error', text: res.error || 'Approval failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: String(err) });
    } finally {
      setActionLoading(false);
    }
  };

  const handleLock = async () => {
    if (!activeAgreement) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await ApiClient.lockAgreement(tournamentId, activeAgreement.version, creatorWallet);
      if (res.success && res.agreement) {
        setMessage({
          type: 'success',
          text: `Agreement v${res.agreement.version} is now PERMANENTLY LOCKED and immutable.`,
        });
        await loadAgreements();
      } else {
        setMessage({ type: 'error', text: res.error || 'Lock failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: String(err) });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateNewVersion = async () => {
    if (totalBps !== 10000) {
      setMessage({
        type: 'error',
        text: `Financial invariant violation: Total basis points must equal 10,000 (currently ${totalBps}).`,
      });
      return;
    }

    setActionLoading(true);
    setMessage(null);

    try {
      const nextVersion = (agreements.length > 0 ? Math.max(...agreements.map((a) => a.version)) : 0) + 1;
      const rules: AllocationRule[] = [
        { rank: 1, basisPoints: rank1Bps, label: `1st Place (${rank1Bps / 100}%)` },
        { rank: 2, basisPoints: rank2Bps, label: `2nd Place (${rank2Bps / 100}%)` },
        { rank: 3, basisPoints: rank3Bps, label: `3rd Place (${rank3Bps / 100}%)` },
      ];

      const res = await ApiClient.createAgreement({
        tournamentId,
        version: nextVersion,
        prizeAsset,
        prizePoolAmount,
        allocationRules: rules,
        createdBy: creatorWallet,
      });

      if (res.success && res.agreement) {
        setMessage({ type: 'success', text: `Created Prize Agreement v${res.agreement.version}.` });
        setShowCreateVersion(false);
        await loadAgreements();
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to create agreement' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: String(err) });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="badge purple">FINANCIAL PROTOCOL</div>
            <h2>Tournament Prize Agreement</h2>
            <p className="subtitle">
              Authoritative financial rules governing prize pool allocation on Stellar. Once locked, rules are immutable.
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {message && <div className={`alert-${message.type}`}>{message.text}</div>}

          {/* Version Selection Tabs */}
          <div className="version-tabs-header">
            <span className="tab-title">Agreement Versions:</span>
            <div className="version-chips">
              {agreements.map((a) => (
                <button
                  key={a.version}
                  className={`version-chip ${activeAgreement?.version === a.version ? 'active' : ''} ${a.status.toLowerCase()}`}
                  onClick={() => setActiveAgreement(a)}
                >
                  v{a.version} ({a.status})
                </button>
              ))}
              <button
                className="version-chip add-new"
                onClick={() => setShowCreateVersion(!showCreateVersion)}
              >
                + New Version
              </button>
            </div>
          </div>

          {/* Create New Version Panel */}
          {showCreateVersion && (
            <div className="create-version-box">
              <h3>Create Updated Prize Agreement Version</h3>
              <p className="subtext">
                Creating a new version leaves the existing locked agreement intact. The new version must be explicitly approved and locked.
              </p>

              <div className="allocation-inputs-grid">
                <div className="input-group">
                  <label>Rank 1 Allocation (Basis Points)</label>
                  <input
                    type="number"
                    value={rank1Bps}
                    onChange={(e) => setRank1Bps(Number(e.target.value))}
                    step={100}
                  />
                  <span className="bps-preview">{rank1Bps / 100}% = {(prizePoolAmount * rank1Bps) / 10000} {prizeAsset}</span>
                </div>

                <div className="input-group">
                  <label>Rank 2 Allocation (Basis Points)</label>
                  <input
                    type="number"
                    value={rank2Bps}
                    onChange={(e) => setRank2Bps(Number(e.target.value))}
                    step={100}
                  />
                  <span className="bps-preview">{rank2Bps / 100}% = {(prizePoolAmount * rank2Bps) / 10000} {prizeAsset}</span>
                </div>

                <div className="input-group">
                  <label>Rank 3 Allocation (Basis Points)</label>
                  <input
                    type="number"
                    value={rank3Bps}
                    onChange={(e) => setRank3Bps(Number(e.target.value))}
                    step={100}
                  />
                  <span className="bps-preview">{rank3Bps / 100}% = {(prizePoolAmount * rank3Bps) / 10000} {prizeAsset}</span>
                </div>
              </div>

              <div className={`bps-invariant-check ${totalBps === 10000 ? 'valid' : 'invalid'}`}>
                <span>Total Allocation: <strong>{totalBps} bps</strong> / 10,000 bps ({totalBps / 100}%)</span>
                {totalBps === 10000 ? (
                  <span className="check-text">✓ Exact 100% allocation invariant satisfied</span>
                ) : (
                  <span className="check-text">✗ Invariant violation: Must sum to exactly 10,000 bps</span>
                )}
              </div>

              <div className="btn-actions-row">
                <button
                  className="btn-primary"
                  onClick={handleCreateNewVersion}
                  disabled={actionLoading || totalBps !== 10000}
                >
                  Generate Agreement Version
                </button>
                <button className="btn-secondary" onClick={() => setShowCreateVersion(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Active Agreement Detail Card */}
          {activeAgreement && (
            <div className="agreement-display-card">
              <div className="card-top-row">
                <div>
                  <span className="agreement-title">
                    {tournamentName} — Prize Agreement v{activeAgreement.version}
                  </span>
                  <div className="agreement-id-sub">ID: <code>{activeAgreement.agreementId}</code></div>
                </div>
                <div className={`status-badge-lg ${activeAgreement.status.toLowerCase()}`}>
                  {activeAgreement.status === 'LOCKED' ? '🔒 LOCKED' : activeAgreement.status}
                </div>
              </div>

              {/* Material Financial Terms */}
              <div className="financial-terms-grid">
                <div className="term-card">
                  <span className="term-label">Prize Asset</span>
                  <span className="term-value">{activeAgreement.prizeAsset}</span>
                </div>
                <div className="term-card">
                  <span className="term-label">Funded Prize Pool</span>
                  <span className="term-value highlight">
                    {activeAgreement.prizePoolAmount.toLocaleString()} {activeAgreement.prizeAsset}
                  </span>
                </div>
                <div className="term-card">
                  <span className="term-label">Ranking Rule</span>
                  <span className="term-value">Final Verified Score</span>
                </div>
                <div className="term-card">
                  <span className="term-label">Tie-Breaker Rule</span>
                  <span className="term-value">Score &rarr; Accuracy &rarr; Timestamp</span>
                </div>
                <div className="term-card">
                  <span className="term-label">Rounding Rule</span>
                  <span className="term-value">Integer Floor</span>
                </div>
                <div className="term-card">
                  <span className="term-label">Dust Allocation</span>
                  <span className="term-value">Remainder &rarr; Rank 1</span>
                </div>
              </div>

              {/* Tier Allocation Breakdown */}
              <div className="tiers-section">
                <h4>Deterministic Tier Distribution</h4>
                <div className="tiers-list">
                  {activeAgreement.allocationRules.map((rule) => {
                    const tokenAmount = Math.floor(
                      (activeAgreement.prizePoolAmount * rule.basisPoints) / 10000
                    );
                    const percent = rule.basisPoints / 100;
                    return (
                      <div key={rule.rank} className="tier-row">
                        <div className="rank-badge">
                          {rule.rank === 1 ? '🥇 Rank 1' : rule.rank === 2 ? '🥈 Rank 2' : '🥉 Rank 3'}
                        </div>
                        <div className="tier-meta">
                          <span className="bps-tag">{rule.basisPoints.toLocaleString()} bps ({percent}%)</span>
                        </div>
                        <div className="tier-payout">
                          <strong>{tokenAmount} {activeAgreement.prizeAsset}</strong>
                          {rule.rank === 1 && <span className="dust-tag">+ Dust Residual</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cryptographic Commitment */}
              <div className="agreement-hash-box">
                <span className="hash-label">Authoritative Agreement Hash (SHA-256):</span>
                <div className="hash-string">
                  <code>{activeAgreement.agreementHash}</code>
                </div>
                <span className="hash-notice">
                  Cryptographically commits to tournament ID, version, asset, basis point tiers, rounding rules, and residual handling.
                </span>
              </div>

              {/* Approval & Lock Metadata */}
              <div className="lifecycle-meta">
                <div>
                  <strong>Approved By:</strong>{' '}
                  {activeAgreement.approvedBy ? (
                    <code>{activeAgreement.approvedBy.slice(0, 8)}...{activeAgreement.approvedBy.slice(-6)}</code>
                  ) : (
                    <span className="pending-text">Pending Creator Approval</span>
                  )}
                </div>
                <div>
                  <strong>Locked Status:</strong>{' '}
                  {activeAgreement.status === 'LOCKED' ? (
                    <span className="locked-text">Locked at {new Date(activeAgreement.lockedAt || activeAgreement.createdAt).toLocaleDateString()}</span>
                  ) : (
                    <span className="mutable-text">Draft / Mutable</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="agreement-actions-bar">
                {activeAgreement.status !== 'LOCKED' && !activeAgreement.approvedBy && (
                  <button
                    className="btn-primary"
                    onClick={handleApprove}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Approving...' : '✍️ Approve Financial Agreement (Wallet)'}
                  </button>
                )}

                {activeAgreement.status !== 'LOCKED' && activeAgreement.approvedBy && (
                  <button
                    className="btn-danger glow"
                    onClick={handleLock}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Locking...' : '🔒 Lock Agreement Permanently'}
                  </button>
                )}

                {activeAgreement.status === 'LOCKED' && (
                  <div className="immutable-guarantee-notice">
                    <span>🛡️ <strong>Agreement Locked:</strong> Terms are frozen and cannot be modified or tampered with.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
