import { describe, it, expect } from 'vitest';
import { SplashContractClient, SdkConfig } from '../sdk';

describe('SDK SplashContractClient', () => {
  const config: SdkConfig = {
    network: 'testnet',
    contractId: 'CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ',
    rpcUrl: 'https://soroban-testnet.stellar.org',
    horizonUrl: 'https://horizon-testnet.stellar.org'
  };

  const client = new SplashContractClient(config);

  it('exposes contract ID and network targets', () => {
    expect(client.getContractId()).toBe(config.contractId);
    expect(client.getNetwork()).toBe('testnet');
  });

  it('retrieves tournament metadata', async () => {
    const meta = await client.getTournament(101);
    expect(meta.id).toBe(101);
    expect(meta.entryFeeXlm).toBe(10);
    expect(meta.status).toBe('Active');
  });

  it('returns contract version and pause state', async () => {
    const version = await client.getContractVersion();
    const paused = await client.isPaused();
    expect(version).toBe(21);
    expect(paused).toBe(false);
  });
});
