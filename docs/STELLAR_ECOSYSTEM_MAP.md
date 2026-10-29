# 🌌 Stellar Splash: Ecosystem Integration & Architecture Map

---

## 1. High-Level Ecosystem Topology

```mermaid
graph TD
    subgraph ClientLayer ["Client & Player Tier"]
        UI["React 18 / Vite Web dApp"]
        Canvas["Splash Rush Game Engine (HTML5 Canvas / 60 FPS)"]
        Audio["Web Audio API Procedural Synth"]
        WalletKit["Freighter Wallet & Stellar Wallets Kit"]
    end

    subgraph EngineLayer ["Off-Chain Engine & Settlement Verifier"]
        Server["Node.js / Express Server"]
        AntiCheat["Deterministic Physics Replay Validator"]
        Anomaly["Statistical Autoclicker / Fraud Scorer"]
        EventBus["Resilient SSE Heartbeat Stream"]
        Store["Atomic State Persistence & Backup Service"]
    end

    subgraph StellarTier ["Stellar Network Tier (Testnet Protocol 21+)"]
        SorobanRPC["Soroban RPC Node (rpc-testnet.stellar.org)"]
        Horizon["Horizon REST API (horizon-testnet.stellar.org)"]
        Friendbot["Testnet Friendbot Faucet"]
        Explorer["Stellar Expert Blockchain Explorer"]
    end

    subgraph SmartContractTier ["On-Chain Soroban Smart Contracts"]
        Vault["TournamentVaultContract (CACHWJEZ...JD7QYJ)"]
        SAC["SEP-41 Token Contracts (Native XLM & USDC)"]
        Storage["Soroban Persistent Instance Storage with Auto-TTL Extension"]
    end

    UI --> WalletKit
    UI --> Canvas
    UI --> Audio
    WalletKit --> |"Sign Transactions"| SorobanRPC
    Canvas --> |"Signed Match Replays"| Server
    Server --> AntiCheat
    AntiCheat --> Anomaly
    Server --> EventBus
    EventBus --> |"Live SSE Stream"| UI
    Server --> |"Simulate & Submit Settlement"| SorobanRPC
    SorobanRPC --> Vault
    Vault --> SAC
    Vault --> Storage
    UI --> |"Deep Link Inspection"| Explorer
    UI --> |"Faucet Funding"| Friendbot
    Horizon --> |"Network Sequence & Status"| UI
```

---

## 2. Stellar & Soroban Technology Integrations

### 2.1 Soroban Smart Contracts (Protocol 21)
- **Contract Address**: `CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ`
- **Native Soroban Features Utilized**:
  - `env.storage().persistent()` and `env.storage().instance()` for contract state
  - `extend_ttl(17280, 518400)` preventing state archival
  - `env.events().publish(...)` emitting indexed telemetry
  - `env.deployer().update_current_contract_wasm(...)` for secure contract upgrades
  - Emergency circuit breaker `pause()` and `unpause()`

### 2.2 SEP-41 Token Standard & Stellar Asset Contracts (SAC)
- Both native XLM and custom fungible tokens (e.g. testnet USDC) are supported through the standardized Soroban Token interface (`token::Client`).
- Supports both direct `transfer` and delegated `transfer_from` allowance workflows.

### 2.3 Non-Custodial Wallets
- Native `@stellar/freighter-api` integration for signing contract invocations.
- Fallback integration through `@creit.tech/stellar-wallets-kit` supporting Freighter, xBull, Hana, Lobstr, and WalletConnect.
- Zero private keys in local storage.

### 2.4 Blockchain Explorer Deep Linking
- Every transaction hash, contract address, and account public key has dynamic, copy-to-clipboard links pointing directly to [Stellar Expert](https://stellar.expert/explorer/testnet).

### 2.5 Horizon & Soroban RPC Telemetry
- Client queries Stellar Horizon for ledger sequence numbers, average fee statistics, and protocol versions.
- Soroban RPC handles transaction simulation, footprint preflight, and consensus status verification.
