export interface LiveContractEvent {
  type: 'EVENT' | 'CONNECTED';
  contractId?: string;
  topic?: string;
  data?: any;
  ledger?: number;
  timestamp: number;
}

export type ContractEventCallback = (event: LiveContractEvent) => void;

