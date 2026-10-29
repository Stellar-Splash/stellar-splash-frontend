export class FriendbotClientService {
  private static backendUrl: string = 'http://localhost:3000';

  public static async requestTestnetXlm(address: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
    if (!address || !address.startsWith('G')) {
      return { success: false, error: 'Invalid Stellar public address' };
    }

    try {
      // First attempt via engine wallet endpoint
      const response = await fetch(`${this.backendUrl}/api/wallet/fund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: address }),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, txHash: data.txHash };
      }
    } catch {
      // Fallback directly to Stellar official Friendbot
    }

    try {
      const fbRes = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(address)}`);
      if (fbRes.ok) {
        const fbData = (await fbRes.json()) as any;
        return { success: true, txHash: fbData.hash || fbData.id };
      }
      return { success: false, error: 'Friendbot rate limit reached or service unavailable' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error requesting testnet XLM' };
    }
  }
}

