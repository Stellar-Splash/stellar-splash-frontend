# 🌊 Stellar Splash Frontend

The player-facing gaming platform and tournament arena for Stellar Splash on Stellar Testnet.

---

## Core Product

> **Play. Prove. Get Paid.**

Supporting statement:
> **Compete in skill-based tournaments with prize pools funded and settled through Stellar.**

Stellar Splash is a skill-based gaming platform where creators fund tournament prize pools on Stellar, players compete in fast-paced games, gameplay results are deterministically recorded, and verified outcomes become programmable Stellar settlements.

---

## Key Features

1. **Splash Rush Game Engine**:
   - High-speed 45-second browser skill game.
   - Dynamic targets, multipliers, combo chain counters, floating scores, and hazard obstacles.
   - Strict client-side state machine: `READY -> COUNTDOWN -> PLAYING -> COMPLETED -> SUBMITTING -> RESULT_READY`.
   - Comprehensive event stream logging emitting sequence timestamps, points, combos, and coordinates for backend verification.
2. **Stellar Testnet Wallet Integration**:
   - Zero-friction testing: instant testnet wallet generator with automated Friendbot funding.
   - Live balance tracking and network validation for **Stellar Testnet**.
3. **Tournament Discovery & Creation**:
   - Real-time tournament discovery with status filters (`OPEN`, `FUNDING`, `IN_PROGRESS`, `FULL`, `COMPLETED`).
   - Creator suite with explicit separation between **Tournament Configuration** and **Prize Pool Funding**.
4. **Real Stellar Testnet Prize Funding Flow**:
   - Multi-state transaction indicator:
     `READY -> WALLET_REQUIRED -> REVIEW -> SIGNING -> SUBMITTING -> CONFIRMING -> CONFIRMED`.
   - Executes real payment operations to tournament vault addresses on Stellar Testnet.
   - Requires independent transaction verification from backend before tournament opens.
   - Direct links to Stellar Expert Explorer (`https://stellar.expert/explorer/testnet/tx/...`).
5. **Live Tournament Leaderboard**:
   - Real-time player standings.
   - Explicit distinction between **Current Score** and **Final Verified Result**.
6. **On-Chain Financial Dashboard**:
   - Inspects prize pool amounts, assets, funding confirmation status, transaction hashes, and reconciliation status (`RECONCILED`).

---

## Architecture

```text
               +-------------------------------------------+
               |          Stellar Splash Frontend          |
               +-------------------------------------------+
                                     |
         +---------------------------+---------------------------+
         |                                                       |
         v                                                       v
+------------------+                                    +------------------+
|   Splash Rush    |                                    |  Wallet & Stellar|
|   Game Engine    |                                    |  Payment Gateway |
+------------------+                                    +------------------+
| - Canvas loop    |                                    | - Testnet wallet |
| - Particle synth |                                    | - Sign & Submit  |
| - Event log      |                                    | - Vault deposit  |
+------------------+                                    +------------------+
         |                                                       |
         +---------------------------+---------------------------+
                                     |
                                     v
                        +--------------------------+
                        |  Splash Engine (REST)    |
                        |  & Live SSE Event Stream |
                        +--------------------------+
```

---

## Local Development

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Installation
```bash
npm install
```

### Run Tests
```bash
npm test
```

### Start Development Server
```bash
npm run dev
```

Application will be available on `http://localhost:3000` (proxies `/api` to the backend engine on port `4000`).

### Build for Production
```bash
npm run build
```

---

## Game Rules: Splash Rush v1.0.0

- **Round Duration**: 45 seconds.
- **Scoring Formula**:
  ```text
  Score = Base Points + Combo Bonus + Multiplier Bonus - Penalties
  ```
- **Target Types**:
  - **Standard Target (Cyan)**: 100 Base Points.
  - **Burst Target (Purple)**: 200 Base Points.
  - **Golden Target (Gold)**: 300 Base Points.
  - **Hazard Spike (Red)**: -50 Penalty points and resets combo streak to 0.
- **Multipliers**:
  - 5 Combo Streak: 2x
  - 10 Combo Streak: 3x
  - 15+ Combo Streak: 4x
- **Deterministic Recording**: Every action generates an event record ingested by the backend engine to prevent score tampering.
