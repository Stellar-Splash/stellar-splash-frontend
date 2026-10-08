import React, { useState, useEffect } from 'react';
import { ApiClient, PlayerPayoutItem } from '../services/api';

interface PlayerPayoutHistoryModalProps {
  playerWallet: string;
  onClose: () => void;
}

export const PlayerPayoutHistoryModal: React.FC<PlayerPayoutHistoryModalProps> = ({
  playerWallet,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [payouts, setPayouts] = useState<PlayerPayoutItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayouts = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await ApiClient.getPlayerPayouts(playerWallet);
        if (res.success && res.payouts) {
          setPayouts(res.payouts);
        } else if (res.error) {
          setErrorMsg(res.error);
        }
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, [playerWallet]);

  const shortAddr = (addr: string) => {
    if (!addr || addr.length < 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  const totalWon = payouts.reduce((sum, p) => sum + p.recipient.amount, 0);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '750px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#0b0f19',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(99, 102, 241, 0.2)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(5, 8, 17, 0.8)' }}>
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xl">
              🏆
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Player Payout History</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Wallet: <span className="text-indigo-300">{shortAddr(playerWallet)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Total Stats Bar */}
        <div className="grid grid-cols-2 gap-4 px-6 py-3 bg-slate-950/40 border-b border-slate-800 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-slate-500 text-[10px]">Total Prizes Claimed</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">{totalWon} USDC</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-slate-500 text-[10px]">Tournaments Settled</div>
            <div className="text-lg font-bold text-white mt-0.5">{payouts.length}</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMsg && (
            <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/40 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <div className="w-8 h-8 mx-auto border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Fetching verified payout history from Stellar...</p>
            </div>
          ) : payouts.length > 0 ? (
            <div className="space-y-4">
              {payouts.map(({ settlement, recipient, tournament }) => {
                const medal =
                  recipient.rank === 1 ? '🥇' : recipient.rank === 2 ? '🥈' : recipient.rank === 3 ? '🥉' : `#${recipient.rank}`;
                return (
                  <div
                    key={settlement.settlementId}
                    className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{medal}</span>
                        <div>
                          <div className="font-bold text-white text-sm">{tournament.name}</div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">
                            Rank {recipient.rank} • {new Date(settlement.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold text-cyan-400 font-mono">
                          +{recipient.amount} {settlement.prizeAsset}
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950 text-emerald-300 rounded border border-emerald-800 inline-block mt-1">
                          ✓ {settlement.status}
                        </span>
                      </div>
                    </div>

                    {/* Evidence Chain */}
                    <div className="pt-2 border-t border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                      <div>
                        <span className="text-slate-500">Agreement: </span>
                        <span>v{settlement.agreementVersion} ({shortAddr(settlement.agreementHash)})</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Ranking: </span>
                        <span>v{settlement.rankingVersion} ({shortAddr(settlement.rankingHash)})</span>
                      </div>
                      <div className="col-span-1 md:col-span-2 flex items-center justify-between">
                        <div>
                          <span className="text-slate-500">Settlement ID: </span>
                          <span className="text-slate-300">{settlement.settlementId}</span>
                        </div>
                        {recipient.txHash && (
                          <a
                            href={`https://stellar.expert/explorer/testnet/tx/${recipient.txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 underline inline-flex items-center gap-1"
                          >
                            Stellar Explorer ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <span className="text-3xl block">🎮</span>
              <p className="text-sm text-slate-400">No settlement payouts found for this wallet.</p>
              <p className="text-xs">
                Compete in tournaments and earn verifiable finishes to receive deterministic Stellar payouts!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Stellar Splash • Verifiable Outcomes Chain</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
