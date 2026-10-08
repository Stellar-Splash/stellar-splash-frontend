import { Keypair, Horizon, Networks, TransactionBuilder, Operation, Asset, Memo } from '@stellar/stellar-sdk';

export interface WalletState {
  address: string | null;
  publicKey: string | null;
  status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'WRONG_NETWORK';
  network: string;
  balanceXLM: number;
  isEphemeral: boolean;
  secretKey?: string;
}

const HORIZON_TESTNET = 'https://horizon-testnet.stellar.org';
const server = new Horizon.Server(HORIZON_TESTNET);

export class StellarWalletService {
  private static STORAGE_KEY = 'stellar_splash_wallet';

  /**
   * Loads saved wallet from localStorage if available.
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
          network: 'Stellar Testnet',
          balanceXLM: parsed.balanceXLM || 0,
          isEphemeral: parsed.isEphemeral || false,
          secretKey: parsed.secretKey,
        };
      }
    } catch {
      // ignore
    }

    return {
      address: null,
      publicKey: null,
      status: 'DISCONNECTED',
      network: 'Stellar Testnet',
      balanceXLM: 0,
      isEphemeral: false,
    };
  }

  /**
   * Connects or generates an active Stellar Testnet keypair,
   * automatically funding it via Friendbot for zero-friction testing.
   */
  public static async createAndFundTestnetWallet(): Promise<WalletState> {
    const pair = Keypair.random();
    const publicKey = pair.publicKey();
    const secretKey = pair.secret();

    // Fund with Friendbot
    try {
      const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
      await res.json();
    } catch (err) {
      console.warn('Friendbot funding call warning:', err);
    }

    // Query balance
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
      isEphemeral: true,
      secretKey,
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    return state;
  }

  /**
   * Refreshes XLM balance from Horizon.
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
   * Submits a real Stellar Testnet payment to fund a tournament prize vault.
   */
  public static async sendFundingPayment(params: {
    sourceSecret: string;
    destinationVault: string;
    amount: number;
    memoText?: string;
  }): Promise<{ txHash: string; ledger: number }> {
    const { sourceSecret, destinationVault, amount, memoText } = params;
    const sourcePair = Keypair.fromSecret(sourceSecret);
    const sourceAccount = await server.loadAccount(sourcePair.publicKey());

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
    builtTx.sign(sourcePair);

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
