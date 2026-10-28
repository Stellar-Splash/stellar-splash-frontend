export interface SorobanHealthResponse {
  status: 'healthy' | 'unhealthy';
  latestLedger: number;
}

export interface SimulationResult {
  success: boolean;
  minResourceFee: string;
  cost?: {
    cpuInsns: string;
    memBytes: string;
  };
  results?: Array<{
    xdr: string;
    auth?: string[];
  }>;
  error?: string;
}

export interface SendTxResponse {
  status: 'PENDING' | 'DUPLICATE' | 'TRY_AGAIN_LATER' | 'ERROR';
  hash: string;
  latestLedger?: number;
  errorResultXdr?: string;
}

export interface TxStatusResponse {
  status: 'SUCCESS' | 'NOT_FOUND' | 'FAILED';
  latestLedger?: number;
  ledger?: number;
  createdAt?: string;
  resultXdr?: string;
}

export class SorobanRpcService {
  private static RPC_URL =
    import.meta.env?.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';

  /**
   * Helper to execute JSON-RPC 2.0 calls against Soroban RPC endpoint.
   */
  private static async rpcCall<T>(method: string, params: Record<string, any> = {}): Promise<T> {
    const payload = {
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    };

    const res = await fetch(this.RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Soroban RPC HTTP error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    if (data.error) {
      throw new Error(`Soroban RPC error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    return data.result as T;
  }

  /**
   * Checks Soroban RPC health and retrieves latest ledger sequence.
   */
  public static async getHealth(): Promise<SorobanHealthResponse> {
    try {
      const res = await this.rpcCall<{ status: string; latestLedger: number }>('getHealth');
      return {
        status: res.status === 'healthy' ? 'healthy' : 'unhealthy',
        latestLedger: res.latestLedger || 0,
      };
    } catch {
      return { status: 'unhealthy', latestLedger: 0 };
    }
  }

  /**
   * Retrieves the current latest ledger sequence from Soroban RPC.
   */
  public static async getLatestLedger(): Promise<number> {
    try {
      const res = await this.rpcCall<{ id: string; sequence: number }>('getLatestLedger');
      return res.sequence || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Simulates a Soroban contract transaction to estimate CPU/memory footprints and min fees.
   */
  public static async simulateTransaction(txXdr: string): Promise<SimulationResult> {
    try {
      const res = await this.rpcCall<any>('simulateTransaction', { transaction: txXdr });
      if (res.error) {
        return { success: false, minResourceFee: '0', error: res.error };
      }
      return {
        success: true,
        minResourceFee: res.minResourceFee || '100',
        cost: res.cost,
        results: res.results,
      };
    } catch (err: any) {
      return { success: false, minResourceFee: '0', error: err.message };
    }
  }

  /**
   * Submits a signed Soroban transaction XDR to the network.
   */
  public static async sendTransaction(txXdr: string): Promise<SendTxResponse> {
    return this.rpcCall<SendTxResponse>('sendTransaction', { transaction: txXdr });
  }

  /**
   * Polls Soroban RPC getTransaction until status is SUCCESS or FAILED.
   */
  public static async pollTransaction(
    hash: string,
    timeoutMs = 30000,
    pollIntervalMs = 1500
  ): Promise<TxStatusResponse> {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      try {
        const res = await this.rpcCall<any>('getTransaction', { hash });
        if (res.status === 'SUCCESS') {
          return {
            status: 'SUCCESS',
            ledger: res.ledger,
            latestLedger: res.latestLedger,
            resultXdr: res.resultXdr,
          };
        } else if (res.status === 'FAILED') {
          return {
            status: 'FAILED',
            ledger: res.ledger,
            resultXdr: res.resultXdr,
          };
        }
      } catch {
        // continue polling until timeout
      }
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }

    return { status: 'NOT_FOUND' };
  }
}
