import { Keypair, Horizon, Networks, TransactionBuilder, Operation, Asset, Memo } from '@stellar/stellar-sdk';
import {
  isConnected,
  isAllowed,
  setAllowed,
  requestAccess,
  getAddress,
  getNetwork,
  signTransaction,
} from '@stellar/freighter-api';

export interface WalletState {
  address: string | null;
  publicKey: string | null;
  status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'WRONG_NETWORK';
  network: string;
  balanceXLM: number;
  walletType: 'FREIGHTER' | 'EPHEMERAL';
  isEphemeral: boolean;
  secretKey?: string;
}

const HORIZON_TESTNET = 'https://horizon-testnet.stellar.org';
const server = new Horizon.Server(HORIZON_TESTNET);

export class StellarWalletService {
  private static STORAGE_KEY = 'stellar_splash_wallet';

  /**
   * Checks whether the Freighter browser extension is installed and available.
   */
  public static async isFreighterAvailable(): Promise<boolean> {
    try {
      const res = await isConnected();
      return Boolean(res?.isConnected);
    } catch {
      return false;
    }
  }

  /**
   * Validates Freighter network against Stellar Testnet to prevent accidental mainnet interaction.
   */
  public static async checkFreighterNetwork(): Promise<{ isTestnet: boolean; currentNetwork: string }> {
    try {
      const net = await getNetwork();
      const currentNetwork = net?.network || 'UNKNOWN';
      const isTestnet =
        currentNetwork.toUpperCase().includes('TEST') ||
        currentNetwork.toUpperCase().includes('TESTNET');
      return { isTestnet, currentNetwork };
    } catch {
      return { isTestnet: true, currentNetwork: 'Stellar Testnet' };
    }
  }

  /**
   * Non-custodial connection via standard Freighter Wallet extension.
   */
  public static async connectFreighter(): Promise<WalletState> {
    const available = await this.isFreighterAvailable();
    if (!available) {
      throw new Error('Freighter wallet extension was not detected. Please install Freighter from freighter.app.');
    }

    try {
      const accessRes = await requestAccess();
      if (accessRes?.error) {
        throw new Error(`Freighter access error: ${accessRes.error}`);
      }

      const publicKey = accessRes?.address;
      if (!publicKey) {
        throw new Error('Could not retrieve public address from Freighter.');
      }

      const { isTestnet, currentNetwork } = await this.checkFreighterNetwork();
      const balance = await this.refreshBalance(publicKey);

      const state: WalletState = {
        address: publicKey,
        publicKey,
        status: isTestnet ? 'CONNECTED' : 'WRONG_NETWORK',
        network: isTestnet ? 'Stellar Testnet' : currentNetwork,
        balanceXLM: balance,
        walletType: 'FREIGHTER',
        isEphemeral: false,
      };

      // Persist only non-sensitive public state
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify({
          publicKey,
          network: state.network,
          walletType: 'FREIGHTER',
          isEphemeral: false,
        })
      );

      return state;
    } catch (err: any) {
      console.error('Freighter connection error:', err);
      throw err;
    }
  }

  /**
   * Loads saved non-custodial wallet from localStorage if available.
   */
  public static loadSavedWallet(): WalletState {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          address: parsed.publicKey,
          publicKey: parsed.publicKey,
          status: 'CONNECTED',
          network: parsed.network || 'Stellar Testnet',
          balanceXLM: parsed.balanceXLM || 0,
          walletType: parsed.walletType || 'EPHEMERAL',
          isEphemeral: parsed.isEphemeral || false,
          secretKey: parsed.secretKey, // retained in-memory for demo friendbot testing only
        };
      }
    } catch {
      // ignore parsing error
    }

    return {
      address: null,
      publicKey: null,
      status: 'DISCONNECTED',
      network: 'Stellar Testnet',
      balanceXLM: 0,
      walletType: 'FREIGHTER',
      isEphemeral: false,
    };
  }

  /**
   * Fallback for hackathon testing: generates an ephemeral testnet keypair,
   * automatically funded via Friendbot without holding sensitive mainnet secrets.
   */
  public static async createAndFundTestnetWallet(): Promise<WalletState> {
    const pair = Keypair.random();
    const publicKey = pair.publicKey();
    const secretKey = pair.secret();

    try {
      const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
      await res.json();
    } catch (err) {
      console.warn('Friendbot funding call warning:', err);
    }

    let balance = 10000;
    try {
      const account = await server.loadAccount(publicKey);
      const nativeBalance = account.balances.find((b) => b.asset_type === 'native');
      if (nativeBalance) {
        balance = parseFloat(nativeBalance.balance);
      }
    } catch {
      // default friendbot balance
    }

    const state: WalletState = {
      address: publicKey,
      publicKey,
      status: 'CONNECTED',
      network: 'Stellar Testnet',
      balanceXLM: balance,
      walletType: 'EPHEMERAL',
      isEphemeral: true,
      secretKey,
    };

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify({
        publicKey,
        walletType: 'EPHEMERAL',
        isEphemeral: true,
        network: 'Stellar Testnet',
      })
    );

    return state;
  }

  /**
   * Refreshes XLM balance from Stellar Testnet Horizon.
   */
  public static async refreshBalance(publicKey: string): Promise<number> {
    try {
      const account = await server.loadAccount(publicKey);
      const native = account.balances.find((b) => b.asset_type === 'native');
      return native ? parseFloat(native.balance) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Non-custodial transaction signing via Freighter Wallet.
   */
  public static async signWithFreighter(
    xdr: string,
    networkPassphrase = Networks.TESTNET
  ): Promise<string> {
    const result = await signTransaction(xdr, { networkPassphrase });
    return typeof result === 'string' ? result : (result as any)?.signedTxXdr || xdr;
  }

  /**
   * Submits a real Stellar Testnet payment to fund a tournament prize vault.
   */
  public static async sendFundingPayment(params: {
    sourceSecret?: string;
    destinationVault: string;
    amount: number;
    memoText?: string;
    publicKey?: string;
  }): Promise<{ txHash: string; ledger: number }> {
    const { sourceSecret, destinationVault, amount, memoText, publicKey } = params;

    const sourcePub = sourceSecret ? Keypair.fromSecret(sourceSecret).publicKey() : publicKey;
    if (!sourcePub) {
      throw new Error('Source public key or secret key is required.');
    }

    const sourceAccount = await server.loadAccount(sourcePub);

    const tx = new TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: destinationVault,
          asset: Asset.native(),
          amount: amount.toFixed(7),
        })
      )
      .setTimeout(30);

    if (memoText) {
      tx.addMemo(Memo.text(memoText.slice(0, 28)));
    }

    const builtTx = tx.build();

    if (sourceSecret) {
      const sourcePair = Keypair.fromSecret(sourceSecret);
      builtTx.sign(sourcePair);
    } else {
      const signedXdr = await this.signWithFreighter(builtTx.toXDR());
      const signedTx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
      const submission = await server.submitTransaction(signedTx);
      return {
        txHash: submission.hash,
        ledger: submission.ledger,
      };
    }

    const submission = await server.submitTransaction(builtTx);
    return {
      txHash: submission.hash,
      ledger: submission.ledger,
    };
  }

  public static disconnect(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
