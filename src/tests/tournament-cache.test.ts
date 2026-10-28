import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCachedTournaments,
  setCachedTournaments,
  clearTournamentsCache,
  TOURNAMENTS_CACHE_KEY,
  TournamentItem,
} from '../services/api';

class MockStorage implements Storage {
  private store: Record<string, string> = {};
  get length(): number {
    return Object.keys(this.store).length;
  }
  clear(): void {
    this.store = {};
  }
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }
  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

describe('Tournament LocalStorage Caching Layer', () => {
  let mockStorage: MockStorage;

  const sampleTournament: TournamentItem = {
    id: 't-100',
    name: 'Aqua Blitz Cup',
    description: 'Fast water splash competition',
    gameId: 'splash-rush',
    gameVersion: '1.0.0',
    creatorWallet: 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB',
    prizeAsset: 'USDC',
    prizePoolAmount: 250,
    vaultAddress: 'GB6V2A73VUX6KAZD66N6E64B44J7K3XW6P2W3V7QOXWCV7T4KQL3ZPL2',
    maxParticipants: 16,
    currentParticipants: 4,
    startTime: 1000,
    endTime: 2000,
    state: 'OPEN',
    createdAt: 1000,
    updatedAt: 1000,
  };

  beforeEach(() => {
    mockStorage = new MockStorage();
  });

  it('returns null cached item when cache is empty', () => {
    const res = getCachedTournaments(mockStorage);
    expect(res.cached).toBeNull();
    expect(res.isStale).toBe(true);
  });

  it('saves tournaments to storage with timestamp and retrieves as fresh within TTL', () => {
    setCachedTournaments([sampleTournament], 60_000, mockStorage);

    const res = getCachedTournaments(mockStorage);
    expect(res.cached).toHaveLength(1);
    expect(res.cached![0].id).toBe('t-100');
    expect(res.isStale).toBe(false);
  });

  it('marks cached item as stale when TTL has elapsed', () => {
    // Save with 0ms TTL so it immediately expires
    setCachedTournaments([sampleTournament], -1000, mockStorage);

    const res = getCachedTournaments(mockStorage);
    expect(res.cached).toHaveLength(1);
    expect(res.isStale).toBe(true);
  });

  it('clears tournaments cache properly', () => {
    setCachedTournaments([sampleTournament], 60_000, mockStorage);
    expect(mockStorage.getItem(TOURNAMENTS_CACHE_KEY)).not.toBeNull();

    clearTournamentsCache(mockStorage);
    expect(mockStorage.getItem(TOURNAMENTS_CACHE_KEY)).toBeNull();
  });
});
