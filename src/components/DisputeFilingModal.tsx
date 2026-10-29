import React, { useState } from 'react';
import { DisputeFilingRequest, DisputeReasonCode } from '../types/dispute-evidence';
import './DisputeFilingModal.css';

interface DisputeFilingModalProps {
  isOpen: boolean;
  tournamentId: number;
  matchId: string;
  challengerWallet: string;
  onClose: () => void;
  onSubmit: (request: DisputeFilingRequest) => void;
}

export const DisputeFilingModal: React.FC<DisputeFilingModalProps> = ({
  isOpen,
  tournamentId,
  matchId,
  challengerWallet,
  onClose,
  onSubmit,
}) => {
  const [reasonCode, setReasonCode] = useState<DisputeReasonCode>('DESYNC_TICK_MISMATCH');
  const [description, setDescription] = useState('');
  const [evidenceUri, setEvidenceUri] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const bondAmountXlm = 10; // 10 XLM dispute bond

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Please provide a detailed description of the contested match anomaly');
      return;
    }

    onSubmit({
      tournamentId,
      matchId,
      challengerWallet,
      reasonCode,
      description,
      evidenceUri: evidenceUri.trim() || undefined,
      stakedBondXlm: bondAmountXlm,
    });
    onClose();
  };

  return (
    <div className="dispute-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="dispute-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="dispute-modal-header">
          <div className="dispute-title-group">
            <span className="dispute-badge">Soroban Dispute Arbitration</span>
            <h3>Contest Tournament Outcome</h3>
          </div>
          <button className="dispute-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="dispute-form">
          <div className="dispute-meta-box">
            <div>
              <span>Tournament ID:</span> <strong>#{tournamentId}</strong>
            </div>
            <div>
              <span>Match:</span> <strong>{matchId}</strong>
            </div>
            <div>
              <span>Required Staked Bond:</span> <strong className="bond-highlight">{bondAmountXlm} XLM</strong>
            </div>
          </div>

          <label className="dispute-label">Dispute Reason</label>
          <select
            value={reasonCode}
            onChange={(e) => setReasonCode(e.target.value as DisputeReasonCode)}
            className="dispute-select"
          >
            <option value="DESYNC_TICK_MISMATCH">Simulation Desync (Tick / Seed Divergence)</option>
            <option value="SUSPICIOUS_INPUT_ANOMALY">Input Telemetry Anomaly (Bot / Autoclicker)</option>
            <option value="UNAUTHORIZED_RESULT_MUTATION">Unauthorized Score Tampering</option>
            <option value="OTHER">Other Contract Invariant Violation</option>
          </select>

          <label className="dispute-label">Evidence & Observations</label>
          <textarea
            rows={4}
            placeholder="Describe the discrepancy observed during the match replay..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrorMsg(null);
            }}
            className="dispute-textarea"
          />

          <label className="dispute-label">Evidence File URI (IPFS / Arweave / HTTPS)</label>
          <input
            type="text"
            placeholder="ipfs://bafy... or https://..."
            value={evidenceUri}
            onChange={(e) => setEvidenceUri(e.target.value)}
            className="dispute-input"
          />

          {errorMsg && <div className="dispute-error">{errorMsg}</div>}

          <div className="dispute-footnote">
            Notice: If the dispute is deemed fraudulent by admin arbitration, the {bondAmountXlm} XLM bond will be forfeited to the tournament prize pool.
          </div>

          <div className="dispute-actions">
            <button type="button" className="dispute-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="dispute-btn-primary">
              Stake {bondAmountXlm} XLM & File Dispute
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
