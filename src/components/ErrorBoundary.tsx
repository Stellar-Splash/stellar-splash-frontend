import React, { Component, ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.state = { ...this.state, errorInfo };
    try {
      this.setState({ errorInfo });
    } catch {
      // safe fallback in test environments
    }
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    });
  };

  public copyDiagnosticReport = (): void => {
    const { error, errorInfo } = this.state;
    const report = [
      `=== Stellar Splash Crash Report ===`,
      `Timestamp: ${new Date().toISOString()}`,
      `UserAgent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'}`,
      `Message: ${error?.message ?? 'Unknown error'}`,
      `Stack:\n${error?.stack ?? 'N/A'}`,
      `ComponentStack:\n${errorInfo?.componentStack ?? 'N/A'}`,
    ].join('\n\n');

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(report).then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2500);
      }).catch(() => {
        // Fallback or ignore
      });
    }
  };

  public override render(): ReactNode {
    const { hasError, error, copied } = this.state;
    const { children, fallback } = this.props;

    if (!hasError) {
      return children;
    }

    if (typeof fallback === 'function') {
      return fallback(error || new Error('Unknown error'), this.reset);
    }

    if (fallback) {
      return fallback;
    }

    return (
      <div
        role="alert"
        aria-live="assertive"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '260px',
          padding: '2rem',
          margin: '1.5rem',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(239, 68, 68, 0.15)',
          color: '#f8fafc',
          fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 700, color: '#fca5a5' }}>
          Application Encountered an Unexpected Error
        </h2>
        <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#94a3b8', maxWidth: '480px', lineHeight: 1.5 }}>
          Stellar Splash caught an unhandled interface exception. Your on-chain funds and Soroban agreements remain secure.
        </p>

        {error && (
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: '#f87171',
              textAlign: 'left',
              overflowX: 'auto',
              maxHeight: '120px',
            }}
          >
            <strong>Error:</strong> {error.message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={this.reset}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            Try Again
          </button>

          <button
            type="button"
            onClick={this.copyDiagnosticReport}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#e2e8f0',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {copied ? '✓ Report Copied!' : 'Copy Crash Report'}
          </button>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.reload();
            }}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              color: '#94a3b8',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}
