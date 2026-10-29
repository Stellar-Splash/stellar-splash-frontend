import React from 'react';
import { SolvencyAuditReport } from '../types/solvency-audit';
import './SolvencyAuditModal.css';

interface SolvencyAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: SolvencyAuditReport;
}

export const SolvencyAuditModal: React.FC<SolvencyAuditModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  if (!isOpen) return null;

  const coveragePercent = Math.min(Math.round(report.reserveCoverageRatio * 100), 200);

  return (
    <div className="solvency-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="solvency-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="solvency-modal-header">
          <div className="solvency-title-group">
            <span className={`solvency-grade-badge ${report.grade.toLowerCase()}`}>
              Grade {report.grade}
            </span>
            <h3>On-Chain Solvency & Reserve Audit</h3>
          </div>
          <button className="solvency-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <p className="solvency-modal-subtitle">
          Real-time cryptographic audit verifying that Soroban smart contract reserves 100% cover all active tournament prize pools.
        </p>

        {/* Coverage Ratio Gauge */}
        <div className="solvency-gauge-card">
          <div className="gauge-header">
            <span>Reserve Collateralization</span>
            <strong className="gauge-percent">{coveragePercent}%</strong>
          </div>
          <div className="gauge-track">
            <div
              className={`gauge-bar ${report.grade.toLowerCase()}`}
              style={{ width: `${Math.min(coveragePercent, 100)}%` }}
            />
          </div>
          <span className="gauge-footnote">
            {report.reserveCoverageRatio >= 1.0
              ? '✓ Fully Collateralized — Prize payouts are mathematically guaranteed'
              : '⚠ Reserve Deficit — Contract balance is less than committed prizes'}
          </span>
        </div>

        {/* Financial Breakdown Table */}
        <div className="solvency-breakdown-table">
          <div className="breakdown-row">
            <span>Smart Contract Vault Balance</span>
            <strong>{report.vaultBalanceXlm.toLocaleString()} XLM</strong>
          </div>
          <div className="breakdown-row">
            <span>Total Committed Prize Liabilities</span>
            <strong>{report.totalCommittedPrizesXlm.toLocaleString()} XLM</strong>
          </div>
          <div className="breakdown-row highlight">
            <span>Unreserved Protocol Surplus</span>
            <strong className={report.unreservedSurplusXlm >= 0 ? 'positive' : 'negative'}>
              {report.unreservedSurplusXlm >= 0 ? '+' : ''}
              {report.unreservedSurplusXlm.toLocaleString()} XLM
            </strong>
          </div>
          <div className="breakdown-row">
            <span>Active Tournaments Audited</span>
            <strong>{report.activeTournamentsCount}</strong>
          </div>
        </div>

        <div className="solvency-modal-footer">
          <a
            href={report.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="solvency-explorer-link"
          >
            Verify Smart Contract on StellarExpert &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};

