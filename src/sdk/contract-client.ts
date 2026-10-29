import { SdkConfig, TournamentMetadata } from './types';

export class SplashContractClient {
  private config: SdkConfig;

  constructor(config: SdkConfig) {
    this.config = config;
  }

  public getContractId(): string {
    return this.config.contractId;
  }

  public getNetwork(): string {
    return this.config.network;
  }

  public async getTournament(tournamentId: number): Promise<TournamentMetadata> {
    return {
      id: tournamentId,
      title: `Tournament #${tournamentId}`,
      entryFeeXlm: 10,
      prizePoolXlm: 500,
      maxPlayers: 64,
      currentPlayers: 42,
      status: 'Active',
      endLedger: 1245000
    };
  }

  public async getContractVersion(): Promise<number> {
    return 21; // Protocol 21
  }

  public async isPaused(): Promise<boolean> {
    return false;
  }
}
