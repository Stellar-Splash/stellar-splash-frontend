import React from 'react';
import { Gamepad2, ShieldCheck, Coins, ArrowRight, Layers } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <div style={{ padding: '48px 32px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div className="badge badge-progress" style={{ marginBottom: '12px' }}>
          <Layers size={14} /> Platform Architecture
        </div>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '12px' }}>
          The Three-Pillar Protocol
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
          Stellar Splash solves gaming trust by turning verified gameplay outcomes into programmable, non-custodial Stellar financial settlements.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Pillar 1: PLAY */}
        <div className="glass-panel" style={{ padding: '32px', borderTop: '4px solid var(--cyan-glow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--cyan-glow)' }}>
              <Gamepad2 size={28} />
            </div>
            <span className="badge badge-open">Active Foundation</span>
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>1. PLAY</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
            Tournament creators configure and fund prize pools with real Stellar Testnet assets. Players join open tournaments and compete in high-speed skill games like <strong>Splash Rush</strong>.
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
            <li>✓ Real Stellar Testnet prize escrow</li>
            <li>✓ Deterministic integer scoring engine</li>
            <li>✓ Independent transaction verification</li>
          </ul>
        </div>

        {/* Pillar 2: PROVE */}
        <div className="glass-panel" style={{ padding: '32px', borderTop: '4px solid var(--purple-neon)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--purple-neon)' }}>
              <ShieldCheck size={28} />
            </div>
            <span className="badge badge-funding">Upcoming Layer</span>
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>2. PROVE</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
            Game events and sequence timestamps are captured in high resolution. The verification engine independently re-executes the match to confirm legitimate play and attest to final standings.
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
            <li>✓ Cryptographic result digests (SHA-256)</li>
            <li>✓ Replay verification against anti-cheat rules</li>
            <li>✓ Verifiable match attestations</li>
          </ul>
        </div>

        {/* Pillar 3: SETTLE */}
        <div className="glass-panel" style={{ padding: '32px', borderTop: '4px solid var(--gold-glow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(255, 184, 0, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--gold-glow)' }}>
              <Coins size={28} />
            </div>
            <span className="badge badge-completed">Future Settlement</span>
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>3. PAY</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
            Attested outcomes trigger programmatic Soroban vault releases. Prize distributions are executed autonomously to winner wallets without granting custodial control to the game server.
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
            <li>✓ Soroban smart contract disbursement</li>
            <li>✓ Multi-recipient automated payouts</li>
            <li>✓ Continuous reconciliation monitoring</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
