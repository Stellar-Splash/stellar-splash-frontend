import React, { useState } from 'react';

export interface VerificationResult {
  matchId: string;
  isValid: boolean;
  score: number;
  ticksAnalyzed: number;
  attestationHash: string;
  verifier: string;
  verifiedAt: number;
  reasons?: string[];
}

export interface ReplayVerifierCardProps {
  initialMatchId?: string;
  onVerify?: (payload: { matchId: string; rawBundleJson?: string }) => Promise<VerificationResult>;
}

export const ReplayVerifierCard: React.FC<ReplayVerifierCardProps> = ({
  initialMatchId = '',
  onVerify,
}) => {
  const [matchId, setMatchId] = useState<string>(initialMatchId);
  const [rawJson, setRawJson] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchId.trim() && !rawJson.trim()) {
      setError('Please provide a Match ID or paste a Replay Bundle JSON.');
      return;
    }

    setError(null);
    setIsVerifying(true);

    try {
      if (onVerify) {
        const res = await onVerify({ matchId: matchId.trim(), rawBundleJson: rawJson.trim() });
        setResult(res);
      } else {
        // Built-in verification simulation
        await new Promise((r) => setTimeout(r, 100));
        setResult({
          matchId: matchId.trim() || 'match-sim-001',
          isValid: true,
          score: 15400,
          ticksAnalyzed: 450,
          attestationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          verifier: 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB',
          verifiedAt: Date.now(),
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Verification failed. Invalid bundle structure.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      role="region"
      aria-label="Replay Verification Tool"
      className="replay-verifier-card"
      style={{
        padding: '1.5rem',
        borderRadius: '12px',
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        color: '#f8fafc',
        maxWidth: '560px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.25rem' }}>🔍</span>
        <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#38bdf8' }}>
          Deterministic Replay Verifier
        </h3>
      </div>

      <p style={{ margin: '0 0 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
        Cryptographically replay and audit match telemetry to prove leaderboard score authenticity.
      </p>

      <form onSubmit={handleVerify}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
            Match ID (Optional if pasting JSON)
          </label>
          <input
            type="text"
            className="input-match-id"
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
            placeholder="e.g. match-splash-rush-102"
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              color: '#f8fafc',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
            Replay Bundle JSON (Optional)
          </label>
          <textarea
            className="input-replay-json"
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            placeholder='Paste raw {"version": 1, "matchId": ...} bundle JSON'
            rows={3}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              color: '#f8fafc',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {error && (
          <div
            role="alert"
            style={{
              padding: '0.5rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#f87171',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn-submit-verify"
          disabled={isVerifying}
          style={{
            width: '100%',
            padding: '0.6rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: isVerifying ? '#0369a1' : '#0284c7',
            color: '#ffffff',
            fontWeight: 600,
            cursor: isVerifying ? 'wait' : 'pointer',
          }}
        >
          {isVerifying ? 'Verifying Telemetry...' : 'Audit & Verify Replay'}
        </button>
      </form>

      {/* Verification Result Display */}
      {result && (
        <div
          data-testid="verification-report"
          style={{
            marginTop: '1.25rem',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: result.isValid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${result.isValid ? '#10b981' : '#ef4444'}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 'bold', color: result.isValid ? '#34d399' : '#f87171' }}>
              {result.isValid ? '✅ Deterministic Match Verified' : '❌ Replay Verification Failed'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {`${result.ticksAnalyzed} Ticks`}
            </span>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            <div>
              <strong>Calculated Score:</strong> {result.score.toLocaleString()}
            </div>
            <div style={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.75rem' }}>
              <strong>Attestation Hash:</strong> {result.attestationHash}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
