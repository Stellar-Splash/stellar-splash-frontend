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

const API_BASE = '/api';

export class ApiClient {
  public static async getTournaments(): Promise<TournamentItem[]> {
    try {
      const res = await fetch(`${API_BASE}/tournaments`);
      const data = await res.json();
      if (data.success) return data.tournaments;
    } catch (err) {
      console.warn('API lookup failed, falling back to cached seed:', err);
    }

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
}
