export type SupportedWalletType = 'freighter' | 'lobstr' | 'xbull' | 'albedo' | 'sandbox';

export interface WalletProviderInfo {
  id: SupportedWalletType;
  name: string;
  icon: string;
  isInstalled: boolean;
  installUrl: string;
  description: string;
}

export interface ConnectedWalletState {
  isConnected: boolean;
  walletType?: SupportedWalletType;
  publicKey?: string;
  network: 'TESTNET' | 'PUBLIC';
  balanceXlm?: string;
  error?: string;
}

export interface WalletAdapterEvents {
  onConnect?: (state: ConnectedWalletState) => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

