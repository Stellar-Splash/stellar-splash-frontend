import React, { useState } from 'react';
import { JudgeDemoService } from '../services/judge-demo.service';
import './JudgeDemoBanner.css';

interface JudgeDemoBannerProps {
  onLaunchDemo?: (scenarioId: string) => void;
}

export const JudgeDemoBanner: React.FC<JudgeDemoBannerProps> = ({ onLaunchDemo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const scenarios = JudgeDemoService.getPresetScenarios();

  return (
    <div className="judge-demo-banner" role="banner" aria-label="Hackathon Judge Sandbox">
      <div className="judge-banner-summary">
        <span className="judge-badge">Hackathon Judge Mode</span>
        <span className="judge-tagline">
          Evaluating Stellar Splash? Launch an end-to-end tournament with automated Soroban settlement in 5 seconds.
        </span>
        <button
          className="judge-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close Scenarios ▲' : '⚡ 1-Click Judge Demo ▼'}
        </button>
      </div>

      {isOpen && (
        <div className="judge-scenarios-panel">
          {scenarios.map((sc) => (
            <div key={sc.scenarioId} className="scenario-card">
              <div className="scenario-title-row">
                <h4>{sc.title}</h4>
                <span className="scenario-prize">{sc.targetPrizeXlm} XLM Pool</span>
              </div>
              <p className="scenario-desc">{sc.description}</p>
              <ul className="scenario-steps-list">
                {sc.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
              <button
                className="scenario-run-btn"
                onClick={() => {
                  onLaunchDemo?.(sc.scenarioId);
                  setIsOpen(false);
                }}
              >
                Run Scenario &rarr;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

