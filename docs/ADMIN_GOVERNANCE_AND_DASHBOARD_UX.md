# Admin Governance & Operator Dashboard UX Specification

## 1. Overview & Architectural Principles
The Stellar Splash Admin Governance Dashboard provides platform administrators and tournament arbiters with real-time operational observability, solvency assurance, dispute management, and cryptographic audit controls.

Given the irreversible nature of on-chain escrow settlements on Stellar/Soroban, the administrative interface follows the principle of **Defensive Governance**:
1. **Zero-Trust Access**: Sensitive operations require cryptographically signed session tokens or whitelisted admin keypairs verified against on-chain storage.
2. **Transparent Solvency Auditing**: Real-time comparison between on-chain contract token balances and aggregated outstanding tournament liabilities.
3. **Reproducible Dispute Arbitration**: One-click deterministic verification of dispute-linked match replays without leaving the interface.
4. **Audit Trail Verification**: Direct linking of every financial transaction to StellarExpert block explorer records.

---

## 2. Component Hierarchy & UX Architecture

```
[Admin Governance Dashboard]
 ├── <AdminDashboardGuard> (Route Guard & Role Authorization)
 │    ├── Not Connected State (Wallet prompt)
 │    ├── Unauthorized State (Public key not in admin list)
 │    └── Authorized Child Content
 │         ├── <SolvencyStatusCard> (Treasury & Reserve Telemetry)
 │         │    ├── On-Chain Balance vs. Total Obligations
 │         │    ├── Reserve Ratio Gauge (Healthy / Marginal / Deficit)
 │         │    └── Auto & Manual Refresh Triggers
 │         ├── <ReplayVerifierCard> (Match Anomaly Auditor)
 │         │    ├── Replay Bundle Ingestion (JSON / Base64)
 │         │    ├── Deterministic Simulation Engine Runner
 │         │    └── Anomaly Delta & Cryptographic Checksum View
 │         └── <TransactionHistoryTable> (Financial Ledger)
 │              ├── Category Filtering (Entry Fee, Prize Payout, Pool Funding)
 │              ├── Confirmation & Failure Status Badges
 │              └── Direct <StellarExpertLink> Integration
```

---

## 3. Component Details & Behavior

### 3.1. `AdminDashboardGuard`
- **Purpose**: Guards administrative routes (`/admin`, `/governance`, `/disputes`) against unauthorized access.
- **Access States**:
  - `WALLET_NOT_CONNECTED`: Prompts user to connect Freighter or supported Stellar wallet.
  - `CHECKING_PERMISSIONS`: Displays skeleton pulse loading state while querying `get_admin` and backend role services.
  - `UNAUTHORIZED`: Renders secure warning alert with user's public key and instructions for requesting access.
  - `AUTHORIZED`: Renders nested administrative tools with active session scope.

### 3.2. `SolvencyStatusCard`
- **Telemetry Indicators**:
  - **Vault Balance**: Liquid asset balance currently residing in the Soroban `TournamentVaultContract`.
  - **Total Obligations**: Sum of target prize pools for all `FUNDING`, `OPEN`, `IN_PROGRESS`, and `VERIFYING` tournaments.
  - **Reserve Margin**: Net delta (`Vault Balance - Obligations`).
  - **Solvency Rating**:
    - `SOLVENT` (≥ 100% coverage): Green badge with shield check icon.
    - `MARGINAL` (95% - 99.9% coverage): Amber alert badge with warning icon.
    - `DEFICIT` (< 95% coverage): Red flashing alert badge triggering circuit breaker alerts.

### 3.3. `ReplayVerifierCard`
- **Functionality**:
  - Loads match tick items and compares observed score increments against expected physics and combo rules.
  - Emits `COMPLIANT` status when simulation hash matches player submission.
  - Displays flagged anomalies (e.g., impossible click frequencies, score spikes, tick time jumps).

### 3.4. `TransactionHistoryTable`
- **Financial Ledger Details**:
  - Displays transaction hash, category, amount, asset code, ledger timestamp, and confirmation status.
  - Leverages `<StellarExpertLink>` to give arbiters instant access to on-chain transaction envelopes and Soroban event logs.

---

## 4. Security & Compliance Controls
1. **Session Expiry**: Admin sessions expire after 60 minutes of inactivity, requiring re-authentication.
2. **Action Confirmation**: Critical actions (resolving disputes, extending dispute windows, updating treasury fees) require an explicit confirmation modal with action summary.
3. **Audit Logging**: All admin actions emit tamper-evident audit events recorded by the backend and broadcast via SSE telemetry.
