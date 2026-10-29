import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TournamentDiscovery } from './components/TournamentDiscovery';
import { SplashRushGame } from './components/SplashRushGame';
import { CreateTournamentModal } from './components/CreateTournamentModal';
import { PrizePoolFundingModal } from './components/PrizePoolFundingModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { FinancialDashboardModal } from './components/FinancialDashboardModal';
import { VerificationModal } from './components/VerificationModal';
import { PrizeAgreementModal } from './components/PrizeAgreementModal';
import { TournamentRankingsModal } from './components/TournamentRankingsModal';
import { SettlementModal } from './components/SettlementModal';
import { PlayerPayoutHistoryModal } from './components/PlayerPayoutHistoryModal';
import { HowItWorks } from './components/HowItWorks';
import { NetworkStatusBar } from './components/NetworkStatusBar';
import { ToastContainer } from './components/ToastContainer';
import { ApiClient, TournamentItem } from './services/api';
import { StellarWalletService, WalletState } from './services/stellar-wallet';
import { isEscapeKey } from './utils/accessibility';

export const App: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>(StellarWalletService.loadSavedWallet());
  const [tournaments, setTournaments] = useState<TournamentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('tournaments');

  // Active Modals State
  const [selectedTournament, setSelectedTournament] = useState<TournamentItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showFundingModal, setShowFundingModal] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<boolean>(false);
  const [showFinancialModal, setShowFinancialModal] = useState<boolean>(false);
  const [showAgreementModal, setShowAgreementModal] = useState<boolean>(false);
  const [showRankingsModal, setShowRankingsModal] = useState<boolean>(false);
  const [showSettlementModal, setShowSettlementModal] = useState<boolean>(false);
  const [showPlayerPayoutsModal, setShowPlayerPayoutsModal] = useState<boolean>(false);
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [verificationMatchContext, setVerificationMatchContext] = useState<{ matchId: string; score: number } | null>(null);
  const [showGameView, setShowGameView] = useState<boolean>(false);

  // Load initial tournaments
  const loadTournaments = async () => {
    setLoading(true);
    try {
      const list = await ApiClient.getTournaments();
      setTournaments(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTournaments();

    // Setup SSE listener for real-time updates
    try {
      const events = new EventSource('/api/events');
      events.onmessage = () => {
        loadTournaments();
      };
      return () => events.close();
    } catch {
      // ignore
    }
  }, []);

  // Global Keyboard Accessibility: close any open modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEscapeKey(e)) {
        if (showCreateModal) setShowCreateModal(false);
        else if (showFundingModal) setShowFundingModal(false);
        else if (showLeaderboardModal) setShowLeaderboardModal(false);
        else if (showFinancialModal) setShowFinancialModal(false);
        else if (showAgreementModal) setShowAgreementModal(false);
        else if (showRankingsModal) setShowRankingsModal(false);
        else if (showSettlementModal) setShowSettlementModal(false);
        else if (showPlayerPayoutsModal) setShowPlayerPayoutsModal(false);
        else if (showVerificationModal) setShowVerificationModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showCreateModal,
    showFundingModal,
    showLeaderboardModal,
    showFinancialModal,
    showAgreementModal,
    showRankingsModal,
    showSettlementModal,
    showPlayerPayoutsModal,
    showVerificationModal,
  ]);

  // Handlers for tournament interactions
  const handlePlayTournament = async (t: TournamentItem) => {
    if (!wallet.publicKey) {
      const newWallet = await StellarWalletService.createAndFundTestnetWallet();
      setWallet(newWallet);
    }

    // Join tournament if not already joined
    if (wallet.publicKey) {
      await ApiClient.joinTournament(t.id, wallet.publicKey);
    }

    setSelectedTournament(t);
    setShowGameView(true);
    setActiveTab('play');
  };

  const handleFundTournament = (t: TournamentItem) => {
    setSelectedTournament(t);
    setShowFundingModal(true);
  };

  const handleLeaderboard = (t: TournamentItem) => {
    setSelectedTournament(t);
    setShowLeaderboardModal(true);
  };

  const handleFinancials = (t: TournamentItem) => {
    setSelectedTournament(t);
    setShowFinancialModal(true);
  };

  const handleAgreement = (t: TournamentItem) => {
    setSelectedTournament(t);
    setShowAgreementModal(true);
  };

  const handleRankings = (t: TournamentItem) => {
    setSelectedTournament(t);
    setShowRankingsModal(true);
  };

  const handleSettleTournament = (t: TournamentItem) => {
    setSelectedTournament(t);
    setShowSettlementModal(true);
  };

  const handleOpenPayoutHistory = () => {
    setShowPlayerPayoutsModal(true);
  };

  const handleInspectVerification = (matchId: string, score: number) => {
    setVerificationMatchContext({ matchId, score });
    setShowVerificationModal(true);
  };

  const handleTournamentCreated = (t: TournamentItem) => {
    setTournaments((prev) => [t, ...prev]);
    // Immediately prompt to fund the created tournament
    setSelectedTournament(t);
    setShowFundingModal(true);
  };

  const handleTournamentFunded = (updated: TournamentItem) => {
    setTournaments((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <Navbar
        wallet={wallet}
        onWalletChange={setWallet}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'play' && !selectedTournament && tournaments.length > 0) {
            setSelectedTournament(tournaments[0]);
          }
        }}
        onOpenPayoutHistory={handleOpenPayoutHistory}
      />

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {activeTab === 'tournaments' && (
          <>
            <Hero
              onPlayClick={() => {
                if (tournaments.length > 0) {
                  handlePlayTournament(tournaments[0]);
                } else {
                  setActiveTab('play');
                }
              }}
              onCreateClick={() => setShowCreateModal(true)}
              onExploreClick={() => {
                const el = document.getElementById('discovery-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <div id="discovery-section">
              <TournamentDiscovery
                tournaments={tournaments}
                loading={loading}
                onRefresh={loadTournaments}
                onPlay={handlePlayTournament}
                onFund={handleFundTournament}
                onLeaderboard={handleLeaderboard}
                onFinancials={handleFinancials}
                onAgreement={handleAgreement}
                onRankings={handleRankings}
                onSettle={handleSettleTournament}
                onCreateClick={() => setShowCreateModal(true)}
              />
            </div>
          </>
        )}

        {activeTab === 'play' && (
          <div style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
                Splash Rush Arena
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Competing in:{' '}
                <strong>
                  {selectedTournament ? selectedTournament.name : 'Splash Rush Championship'}
                </strong>
              </p>
            </div>

            <SplashRushGame
              tournamentId={selectedTournament ? selectedTournament.id : 'tourn-splash-001'}
              playerWallet={
                wallet.publicKey ||
                'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB'
              }
              onFinish={loadTournaments}
              onInspectVerification={handleInspectVerification}
            />
          </div>
        )}

        {activeTab === 'how' && <HowItWorks />}
      </main>

      {/* Modals */}
      <CreateTournamentModal
        wallet={wallet}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleTournamentCreated}
      />

      <PrizePoolFundingModal
        tournament={selectedTournament}
        wallet={wallet}
        isOpen={showFundingModal}
        onClose={() => setShowFundingModal(false)}
        onFunded={handleTournamentFunded}
      />

      <LeaderboardModal
        tournament={selectedTournament}
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
      />

      <FinancialDashboardModal
        tournament={selectedTournament}
        isOpen={showFinancialModal}
        onClose={() => setShowFinancialModal(false)}
      />

      <PrizeAgreementModal
        tournamentId={selectedTournament?.id}
        tournamentName={selectedTournament?.name}
        creatorWallet={selectedTournament?.creatorWallet}
        prizePoolAmount={selectedTournament?.prizePoolAmount}
        prizeAsset={selectedTournament?.prizeAsset}
        isOpen={showAgreementModal}
        onClose={() => setShowAgreementModal(false)}
      />

      <TournamentRankingsModal
        tournamentId={selectedTournament?.id}
        tournamentName={selectedTournament?.name}
        creatorWallet={selectedTournament?.creatorWallet}
        isOpen={showRankingsModal}
        onClose={() => setShowRankingsModal(false)}
        onOpenSettlement={() => {
          setShowRankingsModal(false);
          setShowSettlementModal(true);
        }}
      />

      {/* Level 3 Deterministic Settlement Modal */}
      {selectedTournament && showSettlementModal && (
        <SettlementModal
          tournament={selectedTournament}
          userWallet={wallet.publicKey}
          onClose={() => setShowSettlementModal(false)}
          onSettled={loadTournaments}
        />
      )}

      {/* Player Personal Payout History Modal */}
      {showPlayerPayoutsModal && (
        <PlayerPayoutHistoryModal
          playerWallet={wallet.publicKey || 'GCKAZD66N6E64B44J7K3XW6P2W3V7QOXWCV7T4KQL3ZPL2GB6V2A73VU'}
          onClose={() => setShowPlayerPayoutsModal(false)}
        />
      )}

      <VerificationModal
        matchId={verificationMatchContext?.matchId}
        tournamentId={selectedTournament?.id}
        playerWallet={wallet.publicKey || 'GCKAZD66N6E64B44J7K3XW6P2W3V7QOXWCV7T4KQL3ZPL2GB6V2A73VU'}
        initialScore={verificationMatchContext?.score}
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-glass)',
          padding: '24px 32px',
          textAlign: 'center',
          color: 'var(--text-dim)',
          fontSize: '0.8rem',
          background: 'rgba(5, 8, 17, 0.95)',
        }}
      >
        <p>
          Stellar Splash &bull; Verifiable Gaming & Prize Settlement &bull; Powered by Stellar Testnet &amp; Soroban
        </p>
      </footer>

      <NetworkStatusBar />
      <ToastContainer />
    </div>
  );
};
