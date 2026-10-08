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
  state: 'DRAFT' | 'FUNDING' | 'OPEN' | 'FULL' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  fundingTxHash?: string;
  fundingVerifiedAt?: number;
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

    // Default fallback
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
      const data = await res.json();
      return data;
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
          finalVerifiedResult: { score: 2450, resultHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', verified: true },
        },
        {
          rank: 2,
          playerWallet: 'GD4KQL3ZPL2GB6V2A73VUX6KAZD66N6E64B44J7K3XW6P2W3V7QOXWCV',
          shortWallet: 'GD4K...XWCV',
          currentScore: 1820,
          matchesPlayed: 1,
          status: 'ACTIVE',
          scoreLabel: 'Current Score',
          finalVerifiedResult: null,
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
  ): Promise<{ success: boolean; message?: string; error?: string; details?: string; funding?: any; tournament?: TournamentItem }> {
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
}
