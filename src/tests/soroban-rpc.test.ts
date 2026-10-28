import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SorobanRpcService } from '../services/soroban-rpc';

describe('SorobanRpcService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('handles getHealth when endpoint responds successfully', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          jsonrpc: '2.0',
          id: 1,
          result: { status: 'healthy', latestLedger: 554321 },
        }),
      })
    );

    const health = await SorobanRpcService.getHealth();
    expect(health.status).toBe('healthy');
    expect(health.latestLedger).toBe(554321);
  });

  it('handles simulation failures gracefully', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          jsonrpc: '2.0',
          id: 1,
          result: { error: 'HostError: Error(Contract, #6)' },
        }),
      })
    );

    const sim = await SorobanRpcService.simulateTransaction('AAAA...');
    expect(sim.success).toBe(false);
    expect(sim.error).toContain('HostError');
  });

  it('polls transaction status until SUCCESS', async () => {
    let callCount = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          return {
            ok: true,
            json: async () => ({
              jsonrpc: '2.0',
              id: 1,
              result: { status: 'NOT_FOUND' },
            }),
          };
        }
        return {
          ok: true,
          json: async () => ({
            jsonrpc: '2.0',
            id: 2,
            result: { status: 'SUCCESS', ledger: 123456 },
          }),
        };
      })
    );

    const res = await SorobanRpcService.pollTransaction('txhash123', 5000, 10);
    expect(res.status).toBe('SUCCESS');
    expect(res.ledger).toBe(123456);
  });
});
