import {
  Contract,
  Address,
  nativeToScVal,
  Operation,
  TransactionBuilder,
  Networks,
  Horizon,
  xdr,
} from '@stellar/stellar-sdk';
import { SorobanRpcService, SimulationResult } from './soroban-rpc';
import { StellarWalletService } from './stellar-wallet';

export interface ContractInvocationEstimate {
  success: boolean;
  minResourceFeeStroops: string;
  cpuInstructions?: string;
  memoryBytes?: string;
  transactionXdr: string;
  error?: string;
}

export interface ContractInvocationResult {
  txHash: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  ledger?: number;
  error?: string;
}

const TESTNET_HORIZON = 'https://horizon-testnet.stellar.org';
const server = new Horizon.Server(TESTNET_HORIZON);

export class SorobanContractService {
  public static DEFAULT_CONTRACT_ID =
    (import.meta as any)?.env?.VITE_CONTRACT_ID ||
    'CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ';

  /**
   * Constructs a Soroban contract call Operation for funding a tournament prize pool.
   */
  public static buildFundPrizePoolOp(
    funderAddress: string,
    tournamentId: number | bigint,
    amountStroops: bigint,
    contractId = this.DEFAULT_CONTRACT_ID
  ): xdr.Operation {
    const contract = new Contract(contractId);
    return contract.call(
      'fund_prize_pool',
      new Address(funderAddress).toScVal(),
      nativeToScVal(tournamentId, { type: 'u64' }),
      nativeToScVal(amountStroops, { type: 'i128' })
    );
  }


  /**
   * Builds an uncompleted transaction containing the Soroban contract call operation.
   */
  public static async buildRawContractTx(
    sourceAddress: string,
    operation: xdr.Operation,
    networkPassphrase = Networks.TESTNET
  ): Promise<string> {
    const account = await server.loadAccount(sourceAddress);
    const tx = new TransactionBuilder(account, {
      fee: '1000',
      networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(60)
      .build();

    return tx.toXDR();
  }

  /**
   * Simulates contract invocation against Soroban RPC to estimate fees and footprint.
   */
  public static async estimateInvocation(
    sourceAddress: string,
    operation: xdr.Operation
  ): Promise<ContractInvocationEstimate> {
    try {
      const rawXdr = await this.buildRawContractTx(sourceAddress, operation);
      const simulation = await SorobanRpcService.simulateTransaction(rawXdr);

      if (!simulation.success) {
        return {
          success: false,
          minResourceFeeStroops: '0',
          transactionXdr: rawXdr,
          error: simulation.error || 'Contract simulation failed',
        };
      }

      return {
        success: true,
        minResourceFeeStroops: simulation.minResourceFee || '1000',
        cpuInstructions: simulation.cost?.cpuInsns,
        memoryBytes: simulation.cost?.memBytes,
        transactionXdr: rawXdr,
      };
    } catch (err: any) {
      return {
        success: false,
        minResourceFeeStroops: '0',
        transactionXdr: '',
        error: err.message || 'Failed to estimate contract invocation',
      };
    }
  }

  /**
   * End-to-end execution: builds, signs via Freighter, submits to Soroban RPC, and confirms.
   */
  public static async executeContractCall(
    sourceAddress: string,
    operation: xdr.Operation
  ): Promise<ContractInvocationResult> {
    const estimate = await this.estimateInvocation(sourceAddress, operation);
    if (!estimate.success || !estimate.transactionXdr) {
      throw new Error(`Simulation failed: ${estimate.error}`);
    }

    // Sign with Freighter
    const signedXdr = await StellarWalletService.signWithFreighter(estimate.transactionXdr);

    // Submit to Soroban RPC
    const sendRes = await SorobanRpcService.sendTransaction(signedXdr);
    if (sendRes.status === 'ERROR') {
      throw new Error(`Soroban RPC submission error: ${sendRes.errorResultXdr || 'Unknown error'}`);
    }

    // Poll confirmation
    const pollRes = await SorobanRpcService.pollTransaction(sendRes.hash);
    return {
      txHash: sendRes.hash,
      status: pollRes.status,
      ledger: pollRes.ledger,
      error: pollRes.status === 'FAILED' ? 'Transaction execution failed on-chain' : undefined,
    };
  }
}
