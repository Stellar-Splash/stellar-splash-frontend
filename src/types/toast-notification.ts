export type ToastCategory = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'CONTRACT_TX';

export interface ToastItem {
  id: string;
  category: ToastCategory;
  title: string;
  message?: string;
  txHash?: string;
  durationMs?: number;
  timestamp: number;
}
