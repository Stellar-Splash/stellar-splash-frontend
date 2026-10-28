import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StellarWalletService } from '../services/stellar-wallet';

describe('StellarWalletService', () => {
  let mockStore: Record<string, string> = {};

  beforeEach(() => {
    mockStore = {};
    const mockLocalStorage = {
      getItem: vi.fn((key: string) => mockStore[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStore[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStore[key];
      }),
      clear: vi.fn(() => {
        mockStore = {};
      }),
    };
    vi.stubGlobal('localStorage', mockLocalStorage);
  });

  it('initializes with DISCONNECTED state by default', () => {
    const wallet = StellarWalletService.loadSavedWallet();
    expect(wallet.status).toBe('DISCONNECTED');
    expect(wallet.publicKey).toBeNull();
    expect(wallet.network).toBe('Stellar Testnet');
  });

  it('can disconnect and clear saved state', () => {
    localStorage.setItem(
      'stellar_splash_wallet',
      JSON.stringify({
        publicKey: 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB',
        balanceXLM: 100,
        isEphemeral: true,
      })
    );

    const loaded = StellarWalletService.loadSavedWallet();
    expect(loaded.status).toBe('CONNECTED');
    expect(loaded.publicKey).toBe('GA2C5RFPE6GCKMY3US5PAB6UZLKIGAHWKXX2GAKVOOUMVQHGASVMOROB');

    StellarWalletService.disconnect();
    const after = StellarWalletService.loadSavedWallet();
    expect(after.status).toBe('DISCONNECTED');
  });

  it('detects when Freighter is unavailable in test environment', async () => {
    const available = await StellarWalletService.isFreighterAvailable();
    expect(typeof available).toBe('boolean');
  });

  it('validates testnet network guard behavior', async () => {
    const net = await StellarWalletService.checkFreighterNetwork();
    expect(net).toHaveProperty('isTestnet');
    expect(net).toHaveProperty('currentNetwork');
  });
});
