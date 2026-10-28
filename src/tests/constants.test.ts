import { describe, it, expect } from 'vitest';
import {
  STELLAR_CONSTANTS,
  buildExplorerTxUrl,
  buildExplorerAccountUrl,
  buildExplorerContractUrl,
} from '../constants/stellar';

describe('Stellar Constants and URL Builders', () => {
  it('exports valid network configuration', () => {
    expect(STELLAR_CONSTANTS.NETWORK).toBe('TESTNET');
    expect(STELLAR_CONSTANTS.HORIZON_URL).toContain('horizon-testnet.stellar.org');
    expect(STELLAR_CONSTANTS.SOROBAN_RPC_URL).toContain('soroban-testnet.stellar.org');
    expect(STELLAR_CONSTANTS.TOTAL_BASIS_POINTS).toBe(10_000);
  });

  it('builds canonical StellarExpert URLs', () => {
    const tx = 'abc123hash';
    const account = 'GCKAZD66N6E64B44J7K3XW6P2W3V7QOXWCV7T4KQL3ZPL2GB6V2A73VU';
    const contract = 'CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ';

    expect(buildExplorerTxUrl(tx)).toBe(`https://stellar.expert/explorer/testnet/tx/${tx}`);
    expect(buildExplorerAccountUrl(account)).toBe(
      `https://stellar.expert/explorer/testnet/account/${account}`
    );
    expect(buildExplorerContractUrl(contract)).toBe(
      `https://stellar.expert/explorer/testnet/contract/${contract}`
    );
  });
});
