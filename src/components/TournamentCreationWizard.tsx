import React, { useState } from 'react';
import { TournamentCreationFormData, WizardStep } from '../types/tournament-wizard';
import './TournamentCreationWizard.css';

interface TournamentCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TournamentCreationFormData) => void;
}

export const TournamentCreationWizard: React.FC<TournamentCreationWizardProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [step, setStep] = useState<WizardStep>(1);
  const [formData, setFormData] = useState<TournamentCreationFormData>({
    title: '',
    gameId: 'aqua-dash',
    targetPrizeAmountXlm: 100,
    entryFeeXlm: 5,
    maxParticipants: 50,
    disputeWindowHours: 1,
    creatorRoyaltyBps: 250,
    bannerUri: '',
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof TournamentCreationFormData, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleNext = () => {
    if (step < 3) setStep((s) => ((s + 1) as WizardStep));
    else onSubmit(formData);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => ((s - 1) as WizardStep));
  };

  return (
    <div className="wizard-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="wizard-card" onClick={(e) => e.stopPropagation()}>
        <div className="wizard-header">
          <div className="wizard-steps-indicator">
            <span className={`step-circle ${step >= 1 ? 'active' : ''}`}>1</span>
            <span className="step-connector" />
            <span className={`step-circle ${step >= 2 ? 'active' : ''}`}>2</span>
            <span className="step-connector" />
            <span className={`step-circle ${step === 3 ? 'active' : ''}`}>3</span>
          </div>
          <button className="wizard-close-btn" onClick={onClose}>&times;</button>
        </div>

        <h3 className="wizard-title">
          {step === 1 && 'Step 1: Tournament Identity'}
          {step === 2 && 'Step 2: Prize Pool & Economics'}
          {step === 3 && 'Step 3: Verification & Preflight Review'}
        </h3>

        <div className="wizard-body">
          {step === 1 && (
            <div className="wizard-form-group">
              <label>Tournament Title</label>
              <input
                type="text"
                placeholder="e.g. Stellar Splash Grand Prix #1"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="wizard-input"
              />

              <label>Game Discipline</label>
              <select
                value={formData.gameId}
                onChange={(e) => handleChange('gameId', e.target.value)}
                className="wizard-input"
              >
                <option value="aqua-dash">Aqua Dash (Reaction / Obstacle Course)</option>
                <option value="bubble-blaster">Bubble Blaster (Precision Aiming)</option>
                <option value="tide-runner">Tide Runner (Endless Rhythm)</option>
              </select>

              <label>Banner URI (IPFS / Arweave / HTTPS)</label>
              <input
                type="text"
                placeholder="https://..."
                value={formData.bannerUri}
                onChange={(e) => handleChange('bannerUri', e.target.value)}
                className="wizard-input"
              />
            </div>
          )}

          {step === 2 && (
            <div className="wizard-form-group">
              <label>Target Prize Pool (XLM)</label>
              <input
                type="number"
                min="10"
                value={formData.targetPrizeAmountXlm}
                onChange={(e) => handleChange('targetPrizeAmountXlm', parseFloat(e.target.value) || 0)}
                className="wizard-input"
              />

              <label>Entry Fee (XLM)</label>
              <input
                type="number"
                min="0"
                value={formData.entryFeeXlm}
                onChange={(e) => handleChange('entryFeeXlm', parseFloat(e.target.value) || 0)}
                className="wizard-input"
              />

              <label>Max Allowed Participants</label>
              <input
                type="number"
                min="2"
                max="500"
                value={formData.maxParticipants}
                onChange={(e) => handleChange('maxParticipants', parseInt(e.target.value) || 2)}
                className="wizard-input"
              />
            </div>
          )}

          {step === 3 && (
            <div className="wizard-review-summary">
              <div className="review-stat-row">
                <span>Contract Storage Footprint:</span>
                <strong>~14.5 KB Soroban TTL</strong>
              </div>
              <div className="review-stat-row">
                <span>Estimated Preflight Fee:</span>
                <strong>0.015 XLM</strong>
              </div>
              <div className="review-stat-row">
                <span>Dispute Window Duration:</span>
                <strong>{formData.disputeWindowHours} Hour(s)</strong>
              </div>
              <div className="review-stat-row">
                <span>Creator Royalty:</span>
                <strong>{formData.creatorRoyaltyBps / 100}%</strong>
              </div>
            </div>
          )}
        </div>

        <div className="wizard-footer">
          {step > 1 && (
            <button className="wizard-btn-secondary" onClick={handleBack}>
              &larr; Back
            </button>
          )}
          <button className="wizard-btn-primary" onClick={handleNext}>
            {step === 3 ? 'Deploy to Soroban Contract' : 'Next Step &rarr;'}
          </button>
        </div>
      </div>
    </div>
  );
};
