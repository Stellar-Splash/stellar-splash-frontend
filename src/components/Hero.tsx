import React from 'react';
import { Play, PlusCircle, Shield, Award, Sparkles } from 'lucide-react';

interface HeroProps {
  onPlayClick: () => void;
  onCreateClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onPlayClick,
  onCreateClick,
  onExploreClick,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        padding: '64px 32px 48px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      {/* Pill Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(168, 85, 247, 0.12)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          padding: '6px 16px',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          color: 'var(--purple-neon)',
          marginBottom: '24px',
          fontWeight: 600,
        }}
      >
        <Sparkles size={14} />
        <span>Next-Gen Skill Gaming on Stellar</span>
      </div>

      {/* Main Heading: Play. Prove. Get Paid. */}
      <h1
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: '20px',
        }}
      >
        Play.{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, var(--cyan-glow), #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Prove.
        </span>{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, var(--gold-glow), #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Get Paid.
        </span>
      </h1>

      {/* Supporting statement */}
      <p
        style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--text-muted)',
          maxWidth: '720px',
          margin: '0 auto 36px',
          lineHeight: 1.6,
        }}
      >
        Compete in skill-based tournaments with prize pools funded and settled through Stellar.
        Test your reflexes in <strong>Splash Rush</strong>, lock verifiable outcomes, and compete on transparent leaderboards.
      </p>

      {/* CTA Buttons */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
          marginBottom: '64px',
        }}
      >
        <button className="btn-primary" onClick={onPlayClick} style={{ padding: '14px 32px', fontSize: '1rem' }}>
          <Play size={18} /> Play Splash Rush
        </button>

        <button className="btn-secondary" onClick={onExploreClick} style={{ padding: '14px 28px', fontSize: '1rem' }}>
          Discover Tournaments
        </button>

        <button className="btn-purple" onClick={onCreateClick} style={{ padding: '14px 28px', fontSize: '1rem' }}>
          <PlusCircle size={18} /> Create Tournament
        </button>
      </div>

      {/* Key Metric Highlights */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          maxWidth: '960px',
          margin: '0 auto',
        }}
      >
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: 'var(--cyan-glow)', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
            <Award size={28} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>100% Real Testnet</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Zero simulated fake ledger records
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: 'var(--gold-glow)', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
            <Shield size={28} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>Locked Vault Escrow</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Funds protected from arbitrary drain
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: 'var(--purple-neon)', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
            <Sparkles size={28} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>Deterministic Scores</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Client anti-tamper event digest
          </div>
        </div>
      </div>
    </div>
  );
};
