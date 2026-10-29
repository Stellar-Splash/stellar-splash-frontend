import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WifiOff, Wifi, RefreshCw, AlertCircle } from 'lucide-react';

export interface NetworkStatusBannerProps {
  healthCheckUrl?: string;
  retryIntervalSeconds?: number;
  onStatusChange?: (isOnline: boolean) => void;
  mockIsOffline?: boolean; // For deterministic testing & visual previews
}

export const NetworkStatusBanner: React.FC<NetworkStatusBannerProps> = ({
  healthCheckUrl = 'http://localhost:3001/api/health',
  retryIntervalSeconds = 5,
  onStatusChange,
  mockIsOffline,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    mockIsOffline !== undefined
      ? !mockIsOffline
      : typeof navigator !== 'undefined'
      ? navigator.onLine
      : true,
  );
  const [showRestored, setShowRestored] = useState(false);
  const [countdown, setCountdown] = useState<number>(retryIntervalSeconds);
  const [isRetrying, setIsRetrying] = useState(false);
  const timerRef = useRef<any>(null);

  const checkConnectivity = useCallback(async () => {
    if (mockIsOffline !== undefined) {
      const nextOnline = !mockIsOffline;
      setIsOnline(nextOnline);
      onStatusChange?.(nextOnline);
      return nextOnline;
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOnline(false);
      onStatusChange?.(false);
      return false;
    }

    try {
      setIsRetrying(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(healthCheckUrl, {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeoutId);

      const reachable = res.ok;
      setIsOnline(reachable);
      onStatusChange?.(reachable);
      return reachable;
    } catch {
      setIsOnline(false);
      onStatusChange?.(false);
      return false;
    } finally {
      setIsRetrying(false);
    }
  }, [healthCheckUrl, mockIsOffline, onStatusChange]);

  useEffect(() => {
    if (mockIsOffline !== undefined) {
      setIsOnline(!mockIsOffline);
      return;
    }

    const handleOnline = () => {
      checkConnectivity().then((online) => {
        if (online) {
          setShowRestored(true);
          setTimeout(() => setShowRestored(false), 3000);
        }
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      onStatusChange?.(false);
      setCountdown(retryIntervalSeconds);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnectivity, mockIsOffline, onStatusChange, retryIntervalSeconds]);

  // Periodic retry countdown when offline
  useEffect(() => {
    if (isOnline) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          checkConnectivity().then((restored) => {
            if (restored) {
              setShowRestored(true);
              setTimeout(() => setShowRestored(false), 3000);
            }
          });
          return retryIntervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOnline, checkConnectivity, retryIntervalSeconds]);

  const handleManualRetry = async () => {
    setCountdown(retryIntervalSeconds);
    const restored = await checkConnectivity();
    if (restored) {
      setShowRestored(true);
      setTimeout(() => setShowRestored(false), 3000);
    }
  };

  if (isOnline && !showRestored) {
    return null;
  }

  if (showRestored) {
    return (
      <div
        role="status"
        aria-live="polite"
        data-testid="network-restored-banner"
        style={{
          backgroundColor: '#059669',
          color: '#ffffff',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.875rem',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(5, 150, 105, 0.4)',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        <Wifi size={16} />
        <span>Connection restored! Stellar network synchronized.</span>
      </div>
    );
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      data-testid="network-offline-banner"
      style={{
        backgroundColor: '#dc2626',
        color: '#ffffff',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.875rem',
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
        position: 'sticky',
        top: 0,
        zIndex: 999,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <WifiOff size={18} style={{ animation: 'pulse 1.5s infinite' }} />
        <span>
          <strong>Offline Mode:</strong> Internet connection lost. Gameplay results will be cached locally until reconnected.
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '0.8125rem', opacity: 0.9 }}>
          Retrying in {countdown}s...
        </span>
        <button
          type="button"
          onClick={handleManualRetry}
          disabled={isRetrying}
          data-testid="network-retry-button"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: isRetrying ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <RefreshCw size={12} className={isRetrying ? 'animate-spin' : ''} />
          {isRetrying ? 'Checking...' : 'Retry Now'}
        </button>
      </div>
    </div>
  );
};
