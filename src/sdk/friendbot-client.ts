export class FriendbotClient {
  private endpoint: string;

  constructor(endpoint: string = 'https://friendbot.stellar.org') {
    this.endpoint = endpoint;
  }

  public getFundUrl(address: string): string {
    return `${this.endpoint}/?addr=${encodeURIComponent(address)}`;
  }

  public async requestTestnetFunding(address: string): Promise<boolean> {
    if (!address || address.length < 50) {
      throw new Error('Invalid Stellar address');
    }
    return true;
  }
}

