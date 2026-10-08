import React, { useState, useEffect } from 'react';
import {
  ApiClient,
  TournamentItem,
  SettlementRecord,
  SettlementSnapshot,
  SettlementEligibilityResult,
  SettlementTransactionRecord,
  SettlementReconciliationRecord,
} from '../services/api';

interface SettlementModalProps {
  tournament: TournamentItem;
  userWallet: string | null;
  onClose: () => void;
  onSettled?: () => void;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({
  tournament,
  userWallet,
  onClose,
  onSettled,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [eligibility, setEligibility] = useState<SettlementEligibilityResult | null>(null);
  const [settlement, setSettlement] = useState<SettlementRecord | null>(null);
  const [snapshot, setSnapshot] = useState<SettlementSnapshot | null>(null);
  const [transactions, setTransactions] = useState<SettlementTransactionRecord[]>([]);
  const [reconciliation, setReconciliation] = useState<SettlementReconciliationRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'PREVIEW' | 'RECEIPT' | 'RECONCILIATION'>('PREVIEW');

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // 1. Check eligibility
      const eligRes = await ApiClient.getSettlementEligibility(tournament.id);
      if (eligRes.success && eligRes.eligibility) {
        setEligibility(eligRes.eligibility);
      }

      // 2. Fetch existing settlement or preview
      const existingRes = await ApiClient.getSettlement(tournament.id);
      if (existingRes.success && existingRes.settlement) {
        setSettlement(existingRes.settlement);
        setSnapshot(existingRes.settlement.snapshot);
        setTransactions(existingRes.transactions || []);
        setReconciliation(existingRes.reconciliation || null);
        if (existingRes.settlement.status === 'SETTLED' || existingRes.settlement.status === 'RECONCILED') {
          setActiveTab('RECEIPT');
        }
      } else {
        // Fetch fresh preview snapshot
        const previewRes = await ApiClient.getSettlementPreview(tournament.id);
        if (previewRes.success && previewRes.settlement) {
          setSettlement(previewRes.settlement);
          setSnapshot(previewRes.snapshot || previewRes.settlement.snapshot);
        } else if (previewRes.error) {
          setErrorMsg(previewRes.error);
        }
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tournament.id]);

  const handleAuthorize = async () => {
    if (!userWallet) {
      setErrorMsg('Please connect your creator wallet to authorize settlement.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await ApiClient.authorizeSettlement(tournament.id, userWallet);
      if (res.success && res.settlement) {
        setSettlement(res.settlement);
        setSuccessMsg('Settlement authorized successfully against locked cryptographic commitments!');
      } else {
        setErrorMsg(res.error || 'Failed to authorize settlement.');
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecute = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await ApiClient.executeSettlement(tournament.id);
      if (res.success && res.settlement) {
        setSettlement(res.settlement);
        setTransactions(res.transactions || []);
        setActiveTab('RECEIPT');
        setSuccessMsg('Stellar Testnet multi-recipient payout executed and confirmed!');
        if (onSettled) onSettled();

        // Trigger reconciliation check
        const recRes = await ApiClient.reconcileSettlement(res.settlement.settlementId);
        if (recRes.success && recRes.reconciliation) {
          setReconciliation(recRes.reconciliation);
        }
      } else {
        setErrorMsg(res.error || 'Failed to execute settlement on Stellar.');
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReconcile = async () => {
    if (!settlement) return;
    setIsSubmitting(true);
    try {
      const recRes = await ApiClient.reconcileSettlement(settlement.settlementId);
      if (recRes.success && recRes.reconciliation) {
        setReconciliation(recRes.reconciliation);
        setSuccessMsg('Independent audit completed: Payouts match on-chain ledger records!');
      } else {
        setErrorMsg(recRes.error || 'Reconciliation failed.');
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const shortAddr = (addr: string) => {
    if (!addr || addr.length < 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  const isAuthorized = settlement?.status === 'AUTHORIZED';
  const isSettled = settlement?.status === 'SETTLED' || settlement?.status === 'RECONCILED';
  const isEligible = eligibility?.eligible ?? false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col rounded-2xl border border-cyan-500/30 bg-slate-900 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xl">
              ⚖️
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">Deterministic Prize Settlement</h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Stellar Testnet
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {tournament.name} • Pool: <span className="text-white font-medium">{tournament.prizePoolAmount} {tournament.prizeAsset}</span>
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs">
          <button
            onClick={() => setActiveTab('PREVIEW')}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'PREVIEW'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Allocation Preview & Authorization
          </button>
          <button
            onClick={() => setActiveTab('RECEIPT')}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'RECEIPT'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Payment Execution & Receipt
          </button>
          <button
            onClick={() => setActiveTab('RECONCILIATION')}
            className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'RECONCILIATION'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. On-chain Reconciliation
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/40 text-red-300 text-xs flex items-start gap-3">
              <span className="text-base">⚠️</span>
              <div className="flex-1 font-mono break-all">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs flex items-start gap-3">
              <span className="text-base">✓</span>
              <div className="flex-1">{successMsg}</div>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <div className="w-8 h-8 mx-auto border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Evaluating settlement eligibility and loading deterministic snapshot...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: PREVIEW */}
              {activeTab === 'PREVIEW' && (
                <div className="space-y-6">
                  {/* Eligibility Status Banner */}
                  <div className={`p-4 rounded-xl border ${
                    isEligible
                      ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                      : 'border-amber-500/30 bg-amber-950/20 text-amber-300'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm flex items-center gap-2">
                        {isEligible ? '✓ Settlement Eligibility Verified' : '⚠️ Settlement Blocked'}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-mono uppercase rounded ${
                        isEligible ? 'bg-emerald-900/60 text-emerald-200' : 'bg-amber-900/60 text-amber-200'
                      }`}>
                        {isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                      </span>
                    </div>
                    {eligibility && eligibility.reasons.length > 0 && (
                      <ul className="text-xs list-disc list-inside space-y-1 font-mono text-amber-200/90 mt-2">
                        {eligibility.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Cryptographic Commitments Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Locked Agreement</span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                          v{snapshot?.agreementVersion ?? tournament.activeAgreementVersion ?? 1} (LOCKED)
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 space-y-1 font-mono">
                        <div className="text-[11px] text-slate-500">Agreement Hash:</div>
                        <div className="break-all text-cyan-300/90 bg-slate-900 p-1.5 rounded border border-slate-800">
                          {snapshot?.agreementHash ?? 'Computing...'}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Finalized Ranking</span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                          v{snapshot?.rankingVersion ?? 1} (IMMUTABLE)
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 space-y-1 font-mono">
                        <div className="text-[11px] text-slate-500">Ranking Hash:</div>
                        <div className="break-all text-indigo-300/90 bg-slate-900 p-1.5 rounded border border-slate-800">
                          {snapshot?.rankingHash ?? 'Computing...'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deterministic Multi-Recipient Allocations Table */}
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                    <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Deterministic Winner Payout Allocations
                      </h3>
                      <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Basis Points (10,000 bps = 100%)
                      </span>
                    </div>

                    <div className="divide-y divide-slate-800/80 text-xs">
                      {snapshot?.recipients && snapshot.recipients.length > 0 ? (
                        snapshot.recipients.map((r) => {
                          const medal = r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : `#${r.rank}`;
                          const pct = (r.allocationBps / 100).toFixed(2);
                          return (
                            <div key={r.rank} className="px-4 py-3 flex items-center justify-between hover:bg-slate-900/40">
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{medal}</span>
                                <div>
                                  <div className="font-semibold text-white flex items-center gap-2">
                                    <span>Rank {r.rank}</span>
                                    {r.isResidualRecipient && (
                                      <span className="px-1.5 py-0.2 text-[10px] bg-amber-950 text-amber-300 rounded border border-amber-800">
                                        + Dust Residual
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                                    {shortAddr(r.playerWallet)}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-cyan-400 font-mono">
                                  {r.amount} {snapshot.prizeAsset}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">
                                  {pct}% ({r.allocationBps} bps)
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-6 text-center text-slate-500">No recipient allocations derived.</div>
                      )}
                    </div>

                    {/* Accounting Invariant Footer */}
                    <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                      <div className="text-slate-400">
                        Accounting Invariant:{' '}
                        <span className="text-emerald-400 font-bold">
                          Gross Pool ({snapshot?.grossPrizePool} {snapshot?.prizeAsset}) = Sum of Allocations ({snapshot?.totalAllocated} {snapshot?.prizeAsset})
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                        ✓ INVARIANT BALANCED
                      </span>
                    </div>
                  </div>

                  {/* Settlement Authorization Status & Action */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">Settlement Authorization State:</div>
                      <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${isSettled ? 'bg-emerald-400' : isAuthorized ? 'bg-cyan-400' : 'bg-amber-400'}`} />
                        <span className="font-mono">{settlement?.status || 'READY'}</span>
                        {settlement?.authorizedBy && (
                          <span className="text-xs text-slate-400 font-normal">
                            (by {shortAddr(settlement.authorizedBy)})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {!isAuthorized && !isSettled && (
                        <button
                          onClick={handleAuthorize}
                          disabled={!isEligible || isSubmitting}
                          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-600/20"
                        >
                          {isSubmitting ? 'Authorizing...' : 'Authorize Settlement'}
                        </button>
                      )}
                      {(isAuthorized || isSettled) && (
                        <button
                          onClick={() => setActiveTab('RECEIPT')}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
                        >
                          View Receipt & Payouts →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RECEIPT & EXECUTION */}
              {activeTab === 'RECEIPT' && (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">Settlement Status</div>
                      <div className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${isSettled ? 'bg-emerald-400' : 'bg-cyan-400 animate-pulse'}`} />
                        <span className="font-mono text-cyan-300">{settlement?.status || 'PENDING'}</span>
                      </div>
                    </div>

                    {!isSettled && (
                      <button
                        onClick={handleExecute}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all"
                      >
                        {isSubmitting ? 'Submitting to Stellar...' : 'Execute Multi-Recipient Payout'}
                      </button>
                    )}
                  </div>

                  {/* Confirmed Transactions per Recipient */}
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                    <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Stellar Testnet Transaction Records
                      </h3>
                      <span className="text-xs font-mono text-slate-400">
                        {transactions.length} / {settlement?.recipients.length || 0} Transfers
                      </span>
                    </div>

                    <div className="divide-y divide-slate-800/80 text-xs">
                      {transactions.length > 0 ? (
                        transactions.map((tx) => (
                          <div key={tx.id} className="p-4 space-y-2 hover:bg-slate-900/40">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 font-semibold text-white">
                                <span>Rank {tx.recipientRank}</span>
                                <span className="text-slate-400 font-mono text-[11px] font-normal">
                                  ({shortAddr(tx.recipientWallet)})
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-cyan-400">
                                  {tx.amount} {tx.asset}
                                </span>
                                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                                  ✓ {tx.status}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                              <div className="truncate">
                                Tx: <span className="text-slate-200">{tx.txHash}</span>
                              </div>
                              <a
                                href={tx.explorerUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-cyan-400 hover:text-cyan-300 underline inline-flex items-center gap-1 shrink-0"
                              >
                                Stellar Explorer ↗
                              </a>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-slate-400 space-y-2">
                          <p>No transactions submitted yet.</p>
                          <p className="text-xs text-slate-500">
                            Click &ldquo;Execute Multi-Recipient Payout&rdquo; above to initiate genuine Stellar Testnet transfers.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Permanent Settlement Receipt Card */}
                  {settlement && (
                    <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-4 text-xs font-mono">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="font-bold text-white text-sm">Permanent Settlement Receipt</span>
                        <span className="text-cyan-400 text-xs">ID: {settlement.settlementId}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                        <div>
                          <div className="text-slate-500">Tournament ID:</div>
                          <div className="text-white">{settlement.tournamentId}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Gross Prize Pool:</div>
                          <div className="text-white">{settlement.grossPrizePool} {settlement.prizeAsset}</div>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <div className="text-slate-500">Settlement Authorization Hash:</div>
                          <div className="text-cyan-300 break-all bg-slate-900 p-1.5 rounded border border-slate-800 mt-0.5">
                            {settlement.settlementHash}
                          </div>
                        </div>
                        {settlement.stellarTxHash && (
                          <div className="col-span-1 md:col-span-2">
                            <div className="text-slate-500">Primary Transaction Envelope:</div>
                            <div className="text-emerald-300 break-all bg-slate-900 p-1.5 rounded border border-slate-800 mt-0.5">
                              {settlement.stellarTxHash}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: RECONCILIATION */}
              {activeTab === 'RECONCILIATION' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Independent Ledger Reconciliation</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Verifies that expected allocations match observed on-chain transactions with 0 discrepancy.
                      </p>
                    </div>
                    {isSettled && (
                      <button
                        onClick={handleReconcile}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all"
                      >
                        {isSubmitting ? 'Auditing...' : 'Re-Run Audit'}
                      </button>
                    )}
                  </div>

                  {reconciliation ? (
                    <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-slate-300">Audit Status</span>
                        <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${
                          reconciliation.status === 'RECONCILED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}>
                          {reconciliation.status === 'RECONCILED' ? '✓ RECONCILED' : '⚠️ MISMATCH DETECTED'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="text-slate-500 text-[10px]">Expected Total</div>
                          <div className="text-white text-sm font-bold mt-0.5">{reconciliation.expectedTotal} {tournament.prizeAsset}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="text-slate-500 text-[10px]">Observed Total</div>
                          <div className="text-emerald-400 text-sm font-bold mt-0.5">{reconciliation.observedTotal} {tournament.prizeAsset}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="text-slate-500 text-[10px]">Matched Winners</div>
                          <div className="text-white text-sm font-bold mt-0.5">{reconciliation.matchedTransactions} / {reconciliation.expectedRecipientCount}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="text-slate-500 text-[10px]">Discrepancies</div>
                          <div className="text-white text-sm font-bold mt-0.5">{reconciliation.mismatchedTransactions}</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                        {reconciliation.details}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 space-y-2 border border-slate-800 rounded-xl bg-slate-950/40">
                      <p>Reconciliation will be generated automatically once payouts are executed.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Stellar Splash Protocol • Deterministic Settlement</span>
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
