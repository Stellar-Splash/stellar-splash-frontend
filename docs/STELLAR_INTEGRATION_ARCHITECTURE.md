# Stellar Splash - Stellar Ecosystem Integration Architecture

## 1. Multi-Wallet Adapter Integration
Stellar Splash abstracts wallet connection through a unified, reactive adapter layer (`src/services/wallet-adapter.service.ts`):
- **Freighter Wallet**: SEP-0007 compliant browser extension supporting hardware wallets and instant Soroban simulation signatures.
- **Lobstr & xBull**: Mobile and browser-based Stellar wallets via standard browser provider hooks.
- **Sandbox Mock Wallet**: Zero-installation developer and judge mode that simulates authentic testnet keypairs without external software.

## 2. Soroban RPC Integration
- Direct communication with Soroban Testnet RPC (`https://soroban-testnet.stellar.org`).
- Custom `SorobanRpcClient` with automatic failover, exponential backoff retries, and network latency telemetry.
- Contract event subscription streaming via SSE and WebSocket for instant leaderboard and payout toasts.

## 3. Stellar Horizon & Friendbot Integration
- Automated testnet wallet funding via Friendbot (`https://friendbot.stellar.org/?addr={address}`) directly from the UI banner.
- Real-time XLM balance polling and reserve checking to prevent failed transactions caused by minimum ledger balance limits.

## 4. StellarExpert Explorer Deep-Linking
- Every contract address, transaction hash, settlement ledger sequence, and player public key links directly to testnet StellarExpert (`https://stellar.expert/explorer/testnet/`).
- Increases trust, auditability, and transparency for judges and players alike.
