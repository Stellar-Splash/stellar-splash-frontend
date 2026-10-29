import React from 'react';
import { TransactionStep, TransactionStepperState } from '../types/transaction-stepper';
import './TransactionStepperToast.css';

interface TransactionStepperToastProps {
  state: TransactionStepperState | null;
  onDismiss?: () => void;
}

const STEPS: { key: TransactionStep; label: string }[] = [
  { key: 'SIMULATING', label: 'Simulate' },
  { key: 'SIGNING', label: 'Sign' },
  { key: 'SUBMITTING', label: 'Submit' },
  { key: 'CONFIRMED', label: 'Confirmed' },
];

export const TransactionStepperToast: React.FC<TransactionStepperToastProps> = ({
  state,
  onDismiss,
}) => {
  if (!state) return null;

  const getStepStatus = (stepKey: TransactionStep): 'pending' | 'active' | 'completed' | 'failed' => {
    if (state.currentStep === 'REVERTED') {
      return stepKey === 'SUBMITTING' ? 'failed' : 'pending';
    }

    const order: TransactionStep[] = ['SIMULATING', 'SIGNING', 'SUBMITTING', 'CONFIRMED'];
    const currentIdx = order.indexOf(state.currentStep);
    const stepIdx = order.indexOf(stepKey);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) {
      return state.currentStep === 'CONFIRMED' ? 'completed' : 'active';
    }
    return 'pending';
  };

  const isFinished = state.currentStep === 'CONFIRMED' || state.currentStep === 'REVERTED';

  return (
    <div className={`tx-stepper-toast ${state.currentStep.toLowerCase()}`} role="status" aria-live="polite">
      <div className="tx-stepper-header">
        <div className="tx-stepper-title-row">
          <span className="tx-stepper-indicator" />
          <span className="tx-stepper-action">{state.actionName}</span>
        </div>
        {isFinished && onDismiss && (
          <button className="tx-stepper-dismiss" onClick={onDismiss} aria-label="Close notification">
            &times;
          </button>
        )}
      </div>

      <div className="tx-stepper-progress-bar">
        {STEPS.map((s, idx) => {
          const status = getStepStatus(s.key);
          return (
            <React.Fragment key={s.key}>
              <div className={`tx-step-dot ${status}`}>
                <span className="dot-circle" />
                <span className="dot-label">{s.label}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`tx-step-line ${status === 'completed' ? 'filled' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {state.txHash && (
        <div className="tx-stepper-footer">
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${state.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-explorer-link"
          >
            View on StellarExpert &rarr;
          </a>
        </div>
      )}

      {state.errorMessage && (
        <div className="tx-stepper-error-msg">{state.errorMessage}</div>
      )}
    </div>
  );
};

