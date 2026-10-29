import { describe, it, expect, beforeEach } from 'vitest';
import { StellarWalletAdapterService } from '../services/stellar-wallet-adapter.service';

describe('StellarWalletAdapterService', () => {
  let adapter: StellarWalletAdapterService;

  beforeEach(() => {
    adapter = StellarWalletAdapterService.getInstance();
    adapter.disconnect();
  });

  it('lists all supported wallet providers including Sandbox key', () => {
    const providers = adapter.getAvailableProviders();
    expect(providers.length).toBeGreaterThanOrEqual(4);

    const sandbox = providers.find((p) => p.id === 'sandbox');
    expect(sandbox).toBeDefined();
    expect(sandbox?.name).toContain('Sandbox');

    const freighter = providers.find((p) => p.id === 'freighter');
    expect(freighter).toBeDefined();
  });

  it('connects to Hackathon sandbox wallet with default testnet balance', async () => {
    const state = await adapter.connect('sandbox');
    expect(state.isConnected).toBe(true);
    expect(state.walletType).toBe('sandbox');
    expect(state.publicKey).toBeDefined();
    expect(state.network).toBe('TESTNET');
    expect(state.balanceXlm).toBe('10000.0000000');
  });

  it('supports custom public key connection for Lobstr/Albedo', async () => {
    const customKey = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';
    const state = await adapter.connect('lobstr', customKey);
    expect(state.isConnected).toBe(true);
    expect(state.publicKey).toBe(customKey);
    expect(state.walletType).toBe('lobstr');
  });

  it('clears state upon disconnect', async () => {
    await adapter.connect('sandbox');
    expect(adapter.getState().isConnected).toBe(true);

    adapter.disconnect();
    expect(adapter.getState().isConnected).toBe(false);
    expect(adapter.getState().publicKey).toBeUndefined();
  });
});
