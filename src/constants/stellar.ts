import { Networks } from '@stellar/stellar-sdk';

/**
 * Centralized Stellar and Soroban Network Configuration Constants
 */
export const STELLAR_CONSTANTS = {
  NETWORK: 'TESTNET',
  NETWORK_PASSPHRASE: Networks.TESTNET,
  HORIZON_URL:
    (import.meta as any)?.env?.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org',
  SOROBAN_RPC_URL:
    (import.meta as any)?.env?.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
  DEFAULT_CONTRACT_ID:
    (import.meta as any)?.env?.VITE_CONTRACT_ID ||
    'CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ',
  EXPLORER_BASE_URL: 'https://stellar.expert/explorer/testnet',
  STROOPS_PER_XLM: 10_000_000n,
  DEFAULT_FEE_STROOPS: '1000',
  TOTAL_BASIS_POINTS: 10_000,
  FRIENDBOT_URL: 'https://friendbot.stellar.org',
} as const;

export const buildExplorerTxUrl = (txHash: string): string =>
  `${STELLAR_CONSTANTS.EXPLORER_BASE_URL}/tx/${txHash}`;

export const buildExplorerAccountUrl = (publicKey: string): string =>
  `${STELLAR_CONSTANTS.EXPLORER_BASE_URL}/account/${publicKey}`;

export const buildExplorerContractUrl = (contractId: string): string =>
  `${STELLAR_CONSTANTS.EXPLORER_BASE_URL}/contract/${contractId}`;
