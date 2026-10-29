import { describe, it, expect } from 'vitest';

export function formatStellarExpertUrl(type: 'account' | 'contract' | 'tx' | 'ledger', id: string, network: 'testnet' | 'public' = 'testnet'): string {
  const base = network === 'testnet' ? 'https://stellar.expert/explorer/testnet' : 'https://stellar.expert/explorer/public';
  return `${base}/${type}/${id}`;
}

describe('StellarExpert Explorer Link Generator', () => {
  const testAccount = 'GCQ3OLBMJUGWN3PHYE3SDIKKIPVLJSFFWG4Q4CEABGHWGBEBPBKMY6OW';
  const testContract = 'CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ';
  const testTx = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

  it('generates correct testnet account URL', () => {
    const url = formatStellarExpertUrl('account', testAccount);
    expect(url).toBe(`https://stellar.expert/explorer/testnet/account/${testAccount}`);
  });

  it('generates correct testnet contract URL', () => {
    const url = formatStellarExpertUrl('contract', testContract);
    expect(url).toBe(`https://stellar.expert/explorer/testnet/contract/${testContract}`);
  });

  it('generates correct testnet tx hash URL', () => {
    const url = formatStellarExpertUrl('tx', testTx);
    expect(url).toBe(`https://stellar.expert/explorer/testnet/tx/${testTx}`);
  });

  it('generates public network URL when requested', () => {
    const url = formatStellarExpertUrl('tx', testTx, 'public');
    expect(url).toBe(`https://stellar.expert/explorer/public/tx/${testTx}`);
  });
});
