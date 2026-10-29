export interface ChannelStatus {
  publicKey: string;
  sequence: string;
  balanceXlm: number;
  isAvailable: boolean;
}

export class ChannelAccountClient {
  private channels: ChannelStatus[] = [];

  constructor(initialChannels: ChannelStatus[] = []) {
    this.channels = [...initialChannels];
  }

  public registerChannel(channel: ChannelStatus): void {
    this.channels.push(channel);
  }

  public getAvailableChannel(): ChannelStatus | null {
    const found = this.channels.find(c => c.isAvailable && c.balanceXlm > 1.0);
    return found || null;
  }

  public getChannelCount(): number {
    return this.channels.length;
  }
}

