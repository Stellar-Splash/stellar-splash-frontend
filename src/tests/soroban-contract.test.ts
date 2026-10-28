import { describe, it, expect } from 'vitest';
import { Keypair } from '@stellar/stellar-sdk';
import { SorobanContractService } from '../services/soroban-contract';

describe('SorobanContractService Operation Builders', () => {
  const dummyWallet = Keypair.random().publicKey();
  const dummyContract = 'CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ';

  it('builds a valid fund_prize_pool Soroban contract call operation', () => {
    const op = SorobanContractService.buildFundPrizePoolOp(
      dummyWallet,
      101,
      100_000_000n,
      dummyContract
    );

    expect(op).toBeDefined();
    // Verify operation type corresponds to invokeHostFunction
    expect(op.body().switch().name).toBe('invokeHostFunction');
  });

});
