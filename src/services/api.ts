export interface TournamentItem {
  id: string;
  name: string;
  description: string;
  gameId: string;
  gameVersion: string;
  creatorWallet: string;
  prizeAsset: string;
  prizePoolAmount: number;
  vaultAddress: string;
  maxParticipants: number;
  currentParticipants: number;
  startTime: number;
  endTime: number;
  state:
    | 'DRAFT'
    | 'FUNDING'
    | 'OPEN'
    | 'FULL'
    | 'IN_PROGRESS'
    | 'RESULTS_PENDING'
    | 'VERIFYING'
    | 'VERIFIED'
    | 'FINALIZED'
    | 'COMPLETED'
    | 'CANCELLED';
  fundingTxHash?: string;
  fundingVerifiedAt?: number;
  activeAgreementVersion?: number;
  finalRankingHash?: string;
  createdAt: number;
  updatedAt: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerWallet: string;
  shortWallet: string;
  currentScore: number;
  matchesPlayed: number;
  status: 'ACTIVE' | 'DISQUALIFIED';
  scoreLabel: 'Current Score';
  finalVerifiedResult: {
    score: number;
    resultHash: string;
    verified: boolean;
  } | null;
}

export interface ResultAttestation {
  attestationId: string;
  tournamentId: string;
  matchId: string;
  playerWallet: string;
  resultHash: string;
  finalScore: number;
  verificationVersion: string;
  verifierIdentity: string;
  timestamp: number;
  attestationDigest: string;
}

export interface ResultVerification {
  verificationId: string;
  matchId: string;
  tournamentId: string;
  playerWallet: string;
  gameVersion: string;
  submittedScore: number;
  replayedScore: number;
  scoreMatch: boolean;
  resultHash: string;
  verificationAlgorithm: string;
  verificationVersion: string;
  verifier: string;
  verifiedAt: number;
  status: 'VERIFIED' | 'VERIFICATION_FAILED' | 'REJECTED';
  rejectionReason?: string;
  attestation?: ResultAttestation;
}

export interface RankingEntry {
  rank: number;
  playerWallet: string;
  score: number;
  accuracy: number;
  completedAt: number;
  matchId: string;
  resultHash: string;
}

export interface FinalRankingRecord {
  tournamentId: string;
  rankingVersion: number;
  entries: RankingEntry[];
  rankingHash: string;
  finalizedAt: number;
  finalizedBy: string;
}

export interface AllocationRule {
  rank: number;
  basisPoints: number;
  label: string;
}

export interface PrizeAgreement {
  agreementId: string;
  tournamentId: string;
  version: number;
  prizeAsset: string;
  prizePoolAmount: number;
  rankingMethod: 'FINAL_VERIFIED_SCORE';
  allocationRules: AllocationRule[];
  tieRule: 'SCORE_THEN_ACCURACY_THEN_TIMESTAMP';
  roundingRule: 'INTEGER_FLOOR_REMAINDER_TO_RANK_1';
  residualRule: 'ALLOCATE_DUST_TO_FIRST_PLACE';
  agreementHash: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'READY_TO_LOCK' | 'LOCKED' | 'SUPERSEDED' | 'REJECTED';
  createdBy: string;
  createdAt: number;
  approvedBy?: string;
  approvedAt?: number;
  approvalSignature?: string;
  lockedAt?: number;
}

export type SettlementStatus =
  | 'CREATED'
  | 'VALIDATING'
  | 'CALCULATING'
  | 'READY'
  | 'AUTHORIZED'
  | 'SUBMITTING'
  | 'CONFIRMING'
  | 'SETTLED'
  | 'RECONCILED'
  | 'PARTIALLY_SETTLED'
  | 'FAILED'
  | 'REQUIRES_RECONCILIATION'
  | 'CANCELLED';

export interface SettlementRecipient {
  rank: number;
  playerWallet: string;
  allocationBps: number;
  amount: number;
  amountBaseUnits: number;
  isResidualRecipient: boolean;
  txHash?: string;
  ledger?: number;
  status: 'PENDING' | 'SUBMITTED' | 'CONFIRMED' | 'FAILED';
  confirmedAt?: number;
  failureReason?: string;
}

export interface SettlementSnapshot {
  settlementId: string;
  tournamentId: string;
  agreementId: string;
  agreementVersion: number;
  agreementHash: string;
  rankingId: string;
  rankingVersion: number;
  rankingHash: string;
  prizePoolAmount: number;
  prizeAsset: string;
  allocationRules: AllocationRule[];
  roundingRule: string;
  residualRule: string;
  tieRule: string;
  recipients: SettlementRecipient[];
  grossPrizePool: number;
  totalAllocated: number;
  residualAmount: number;
  createdAt: number;
}

export interface SettlementRecord {
  settlementId: string;
  tournamentId: string;
  agreementId: string;
  agreementVersion: number;
  agreementHash: string;
  rankingVersion: number;
  rankingHash: string;
  prizePoolAmount: number;
  prizeAsset: string;
  settlementHash: string;
  status: SettlementStatus;
  recipients: SettlementRecipient[];
  grossPrizePool: number;
  totalAllocated: number;
  residualAmount: number;
  snapshot: SettlementSnapshot;
  authorizedBy?: string;
  authorizedAt?: number;
  executedAt?: number;
  completedAt?: number;
  reconciledAt?: number;
  stellarTxHash?: string;
  stellarLedger?: number;
  explorerUrl?: string;
  failureReason?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SettlementEligibilityResult {
  eligible: boolean;
  tournamentId: string;
  reasons: string[];
  agreement?: PrizeAgreement;
  ranking?: FinalRankingRecord;
}

export interface SettlementTransactionRecord {
  id: string;
  settlementId: string;
  tournamentId: string;
  recipientRank: number;
  recipientWallet: string;
  asset: string;
  amount: number;
  amountBaseUnits: number;
  expectedAmount: number;
  actualAmount: number;
  txHash: string;
  ledger?: number;
  status: 'PENDING' | 'SUBMITTED' | 'CONFIRMED' | 'FAILED' | 'RECONCILIATION_REQUIRED';
  submittedAt: number;
  confirmedAt?: number;
  failureCode?: string;
  failureReason?: string;
  explorerUrl: string;
}

export interface SettlementReconciliationRecord {
  reconciliationId: string;
  settlementId: string;
  tournamentId: string;
  expectedTotal: number;
  observedTotal: number;
  expectedRecipientCount: number;
  observedRecipientCount: number;
  matchedTransactions: number;
  mismatchedTransactions: number;
  status: 'RECONCILED' | 'MISMATCH' | 'REQUIRES_REVIEW' | 'PENDING';
  details: string;
  checkedAt: number;
  discrepancies: string[];
}

export interface PlayerPayoutItem {
  settlement: SettlementRecord;
  recipient: SettlementRecipient;
  tournament: TournamentItem;
}

const API_BASE = '/api';
export const TOURNAMENTS_CACHE_KEY = 'stellar_splash_tournaments_cache_v1';
export const DEFAULT_TOURNAMENTS_CACHE_TTL_MS = 60_000; // 60 seconds

export interface CachedTournamentsEnvelope {
  timestamp: number;
  ttlMs: number;
  tournaments: TournamentItem[];
}

export function getCachedTournaments(storage: Storage | null = typeof window !== 'undefined' ? window.localStorage : null): {
  cached: TournamentItem[] | null;
  isStale: boolean;
} {
  if (!storage) return { cached: null, isStale: true };
  try {
    const raw = storage.getItem(TOURNAMENTS_CACHE_KEY);
    if (!raw) return { cached: null, isStale: true };
    const envelope: CachedTournamentsEnvelope = JSON.parse(raw);
    if (!envelope || !Array.isArray(envelope.tournaments)) {
      return { cached: null, isStale: true };
    }
    const isStale = Date.now() - envelope.timestamp > envelope.ttlMs;
    return { cached: envelope.tournaments, isStale };
  } catch (err) {
    return { cached: null, isStale: true };
  }
}

export function setCachedTournaments(
  tournaments: TournamentItem[],
  ttlMs: number = DEFAULT_TOURNAMENTS_CACHE_TTL_MS,
  storage: Storage | null = typeof window !== 'undefined' ? window.localStorage : null
): void {
  if (!storage) return;
  try {
    const envelope: CachedTournamentsEnvelope = {
      timestamp: Date.now(),
      ttlMs,
      tournaments,
    };
    storage.setItem(TOURNAMENTS_CACHE_KEY, JSON.stringify(envelope));
  } catch (err) {
    // quota exceeded or private mode guard
  }
}

export function clearTournamentsCache(
  storage: Storage | null = typeof window !== 'undefined' ? window.localStorage : null
): void {
  if (!storage) return;
  try {
    storage.removeItem(TOURNAMENTS_CACHE_KEY);
  } catch (err) {
    // ignore
  }
}

export class ApiClient {
  public static async getTournaments(options?: {
    forceFresh?: boolean;
    ttlMs?: number;
  }): Promise<TournamentItem[]> {
    const { cached, isStale } = getCachedTournaments();

    // Stale-while-revalidate: if fresh cache exists and fresh not forced, return immediately
    if (cached && !isStale && !options?.forceFresh) {
      return cached;
    }

    // Trigger revalidation promise
    const fetchFresh = async (): Promise<TournamentItem[] | null> => {
      try {
        const res = await fetch(`${API_BASE}/tournaments`);
        const data = await res.json();
        if (data.success && Array.isArray(data.tournaments)) {
          setCachedTournaments(data.tournaments, options?.ttlMs ?? DEFAULT_TOURNAMENTS_CACHE_TTL_MS);
          return data.tournaments;
        }
      } catch (err) {
        console.warn('API lookup failed:', err);
      }
      return null;
    };

    // If stale cached tournaments exist and fresh not strictly required, return stale immediately while revalidating
    if (cached && !options?.forceFresh) {
      // Background revalidation
      fetchFresh().catch(() => {});
      return cached;
    }

    const fresh = await fetchFresh();
    if (fresh) return fresh;
    if (cached) return cached;

    return [
      {
        id: 'tourn-splash-001',
        name: 'Splash Rush Genesis Cup',
        description: 'The inaugural skill championship on Stellar Splash. Race the clock and claim the pool!',
        gameId: 'splash-rush',
        gameVersion: '1.0.0',
        creatorWallet: 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB',
        prizeAsset: 'USDC',
        prizePoolAmount: 100,
        vaultAddress: 'GB6V2A73VUX6KAZD66N6E64B44J7K3XW6P2W3V7QOXWCV7T4KQL3ZPL2',
        maxParticipants: 32,
        currentParticipants: 3,
        startTime: Date.now() - 3600000,
        endTime: Date.now() + 86400000 * 7,
        state: 'OPEN',
        fundingTxHash: 'd7a1f59c8d32be04130089aefb20468a2bf6cb8b3fa7e06a3826090e719543be',
        fundingVerifiedAt: Date.now() - 3500000,
        activeAgreementVersion: 1,
        createdAt: Date.now() - 3600000,
        updatedAt: Date.now() - 3500000,
      },
    ];
  }

  public static async createTournament(params: {
    name: string;
    description: string;
    creatorWallet: string;
    prizeAsset: string;
    prizePoolAmount: number;
    maxParticipants: number;
    startTime: number;
    endTime: number;
  }): Promise<{ success: boolean; tournament?: TournamentItem; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  public static async joinTournament(
    tournamentId: string,
    playerWallet: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/tournaments/${tournamentId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerWallet }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  public static async getLeaderboard(
    tournamentId: string
  ): Promise<{ leaderboard: LeaderboardEntry[]; tournamentName?: string }> {
    try {
      const res = await fetch(`${API_BASE}/tournaments/${tournamentId}/leaderboard`);
      const data = await res.json();
      if (data.success) {
        return { leaderboard: data.leaderboard, tournamentName: data.tournamentName };
      }
    } catch {
      // fallback
    }

    return {
      leaderboard: [
        {
          rank: 1,
          playerWallet: 'GCKAZD66N6E64B44J7K3XW6P2W3V7QOXWCV7T4KQL3ZPL2GB6V2A73VU',
          shortWallet: 'GCKA...73VU',
          currentScore: 2450,
          matchesPlayed: 2,
          status: 'ACTIVE',
          scoreLabel: 'Current Score',
          finalVerifiedResult: {
            score: 2450,
            resultHash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
            verified: true,
          },
        },
      ],
    };
  }

  public static async getPrizePool(tournamentId: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/tournaments/${tournamentId}/prize-pool`);
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  public static async submitFunding(
    tournamentId: string,
    txHash: string,
    funderWallet: string
  ): Promise<{
    success: boolean;
    message?: string;
    error?: string;
    details?: string;
    funding?: any;
    tournament?: TournamentItem;
  }> {
    try {
      const res = await fetch(`${API_BASE}/tournaments/${tournamentId}/prize-pool/funding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash, funderWallet }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  public static async startGame(
    tournamentId: string,
    playerWallet: string
  ): Promise<{ success: boolean; match?: any; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/games/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId, playerWallet, gameId: 'splash-rush' }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  public static async completeGame(params: {
    matchId: string;
    sessionToken: string;
    endTime: number;
    events: any[];
  }): Promise<{ success: boolean; result?: any; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/games/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  // --- Level 2 Verification APIs ---
  public static async verifyMatch(
    matchId: string
  ): Promise<{ success: boolean; verification?: ResultVerification; error?: string; details?: string }> {
    try {
      const res = await fetch(`${API_BASE}/verification/match/${matchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  public static async getVerification(
    matchId: string
  ): Promise<{ success: boolean; verification?: ResultVerification; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/verification/match/${matchId}`);
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  // --- Level 2 Rankings APIs ---
  public static async getTournamentRanking(
    tournamentId: string
  ): Promise<{ success: boolean; finalized: boolean; ranking: FinalRankingRecord; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/rankings/${tournamentId}`);
      return await res.json();
    } catch (err) {
      return {
        success: true,
        finalized: false,
        ranking: {
          tournamentId,
          rankingVersion: 1,
          entries: [
            {
              rank: 1,
              playerWallet: 'GCKAZD66N6E64B44J7K3XW6P2W3V7QOXWCV7T4KQL3ZPL2GB6V2A73VU',
              score: 2450,
              accuracy: 95,
              completedAt: Date.now() - 2750000,
              matchId: 'match-genesis-001',
              resultHash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
            },
          ],
          rankingHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
          finalizedAt: Date.now() - 2700000,
          finalizedBy: 'verifier.stellar-splash.org',
        },
      };
    }
  }

  public static async finalizeTournamentRanking(
    tournamentId: string,
    finalizedBy: string
  ): Promise<{ success: boolean; ranking?: FinalRankingRecord; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/rankings/${tournamentId}/finalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finalizedBy }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  // --- Level 2 Prize Agreement APIs ---
  public static async getTournamentAgreements(
    tournamentId: string
  ): Promise<{ success: boolean; agreements: PrizeAgreement[]; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/agreements/${tournamentId}`);
      return await res.json();
    } catch (err) {
      return {
        success: true,
        agreements: [
          {
            agreementId: `agr-${tournamentId}-v1`,
            tournamentId,
            version: 1,
            prizeAsset: 'USDC',
            prizePoolAmount: 100,
            rankingMethod: 'FINAL_VERIFIED_SCORE',
            allocationRules: [
              { rank: 1, basisPoints: 5000, label: '1st Place (50%)' },
              { rank: 2, basisPoints: 3000, label: '2nd Place (30%)' },
              { rank: 3, basisPoints: 2000, label: '3rd Place (20%)' },
            ],
            tieRule: 'SCORE_THEN_ACCURACY_THEN_TIMESTAMP',
            roundingRule: 'INTEGER_FLOOR_REMAINDER_TO_RANK_1',
            residualRule: 'ALLOCATE_DUST_TO_FIRST_PLACE',
            agreementHash: 'b4a8e23f1c9d784a0b5e6f3c2d1a89b7e4f3c2d1a0b9e8f7a6b5c4d3e2f1a0b9',
            status: 'LOCKED',
            createdBy: 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB',
            createdAt: Date.now() - 3600000,
            approvedBy: 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB',
            approvedAt: Date.now() - 3500000,
            lockedAt: Date.now() - 3500000,
          },
        ],
      };
    }
  }

  public static async getActiveAgreement(
    tournamentId: string
  ): Promise<{ success: boolean; agreement?: PrizeAgreement; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/agreements/${tournamentId}/active`);
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  public static async createAgreement(params: {
    tournamentId: string;
    version: number;
    prizeAsset: string;
    prizePoolAmount: number;
    allocationRules: AllocationRule[];
    createdBy: string;
  }): Promise<{ success: boolean; agreement?: PrizeAgreement; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/agreements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  public static async approveAgreement(
    tournamentId: string,
    version: number,
    approverWallet: string
  ): Promise<{ success: boolean; agreement?: PrizeAgreement; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/agreements/${tournamentId}/${version}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approverWallet }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  public static async lockAgreement(
    tournamentId: string,
    version: number,
    actorWallet: string
  ): Promise<{ success: boolean; agreement?: PrizeAgreement; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/agreements/${tournamentId}/${version}/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorWallet }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  // --- Settlements & Payouts ---
  public static async getSettlementEligibility(
    tournamentId: string
  ): Promise<{ success: boolean; eligibility?: SettlementEligibilityResult; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/settlements/${tournamentId}/eligibility`);
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  public static async getSettlementPreview(
    tournamentId: string
  ): Promise<{
    success: boolean;
    settlement?: SettlementRecord;
    snapshot?: SettlementSnapshot;
    isExisting?: boolean;
    error?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/settlements/${tournamentId}/preview`);
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  public static async authorizeSettlement(
    tournamentId: string,
    authorizedBy: string
  ): Promise<{ success: boolean; settlement?: SettlementRecord; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/settlements/${tournamentId}/authorize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorizedBy }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  public static async executeSettlement(
    tournamentId: string,
    vaultSecretKey?: string
  ): Promise<{
    success: boolean;
    settlement?: SettlementRecord;
    transactions?: SettlementTransactionRecord[];
    error?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/settlements/${tournamentId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vaultSecretKey }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  public static async getSettlement(
    tournamentId: string
  ): Promise<{
    success: boolean;
    settlement?: SettlementRecord;
    transactions?: SettlementTransactionRecord[];
    reconciliation?: SettlementReconciliationRecord;
    error?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/settlements/${tournamentId}`);
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  public static async reconcileSettlement(
    settlementId: string
  ): Promise<{ success: boolean; reconciliation?: SettlementReconciliationRecord; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/settlements/${settlementId}/reconcile`, {
        method: 'POST',
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  public static async getPlayerPayouts(
    playerWallet: string
  ): Promise<{ success: boolean; count?: number; payouts?: PlayerPayoutItem[]; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/settlements/player/${playerWallet}`);
      return await res.json();
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
}
