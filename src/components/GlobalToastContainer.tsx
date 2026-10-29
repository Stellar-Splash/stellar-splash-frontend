import React from 'react';
import { ToastItem } from '../types/toast-notification';
import './GlobalToastContainer.css';

interface GlobalToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const GlobalToastContainer: React.FC<GlobalToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="global-toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-notification-card ${toast.category.toLowerCase()}`}
          role="alert"
        >
          <div className="toast-icon">
            {toast.category === 'SUCCESS' && '✓'}
            {toast.category === 'ERROR' && '✕'}
            {toast.category === 'WARNING' && '⚠'}
            {toast.category === 'CONTRACT_TX' && '⚡'}
            {toast.category === 'INFO' && 'ℹ'}
          </div>

          <div className="toast-body">
            <h5 className="toast-title">{toast.title}</h5>
            {toast.message && <p className="toast-message">{toast.message}</p>}
            {toast.txHash && (
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${toast.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="toast-tx-link"
              >
                Explorer &rarr;
              </a>
            )}
          </div>

          <button
            className="toast-close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};
