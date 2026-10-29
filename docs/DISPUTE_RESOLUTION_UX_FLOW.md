# Dispute Resolution & Challenge Review UX Specification

## 1. Overview & Objective
Stellar Splash enforces trustless eSports integrity by combining client-side deterministic replays with on-chain Soroban escrow holds. When a tournament concludes, a mandatory **Dispute Window** opens (minimum 300 seconds). During this interval, participants can file cryptographic challenges if match desynchronization, illegal actions, or score anomalies are identified.

This document describes the user experience, challenge filing states, reviewer workflows, and integration with Soroban smart contracts.

---

## 2. Dispute Lifecycle States
Every challenge transitions through a strictly defined lifecycle:

```
[Tournament Completed] 
         │
         ▼
[Dispute Window Opens (≥ 300s)]
         │
    ┌────┴────────────────────────┐
    │ No Disputes Filed           │ Participant Files Dispute
    ▼                             ▼
[Window Elapses]             [Dispute Active / Escrow Hold]
    │                             │
    │                      ┌──────┴──────────────┐
    │                      ▼                     ▼
    │               [Admin Resolves]      [Admin Dismisses]
    │                      │                     │
    └──────────────────────┼─────────────────────┘
                           ▼
              [Settlement Execution Allowed]
```

1. **ACTIVE**: A challenge has been submitted on-chain. Escrow funds are locked; `execute_settlement` is rejected by the contract.
2. **RESOLVED**: Administrative review verified the dispute as valid. Scores or rankings are recomputed, and payouts updated.
3. **DISMISSED**: The challenge was determined to be unsubstantiated or frivolous. The dispute flag is cleared, unblocking settlement.

---

## 3. Reason Code Taxonomy
Challenges must provide standardized reason codes synchronized between frontend schemas, engine services, and the Soroban contract:

| Code | Label | Description | Evidence Required |
|---|---|---|---|
| `101` | **Tick Desync** | Input frame count or event timestamp mismatch | Full replay bundle SHA-256 |
| `102` | **Illegal Action** | Action executed without requisite resources or state | Offending tick sequence index |
| `103` | **Score Anomaly** | Score increment exceeds theoretical maximum bounds | Delta tick log |
| `104` | **Timeout Abuse** | Stall tactics violating maximum idle duration | Client clock and ping telemetry |
| `105` | **Collusion** | Suspicious cooperation in multi-party brackets | Replay telemetry from all participants |
| `199` | **Other** | Miscellaneous protocol or rules violations | Freeform description + hash |

---

## 4. Frontend Component Architecture

### `DisputeResolutionModal`
The primary interface for inspecting and moderating active challenges (`src/components/DisputeResolutionModal.tsx`).
- **Trigger**: Clickable from `TournamentCard`, `DisputeBanner`, or admin management tables.
- **Header**: Displays tournament title, ID, challenger wallet badge, and live StellarExpert deep-link.
- **Challenge Reason Details**:
  - Reason code tag with descriptive subtitle.
  - Formatted elapsed filing timestamp (`YYYY-MM-DD HH:mm:ss UTC`).
  - Cryptographic evidence SHA-256 hash with one-click copy button.
- **Reviewer Actions** (Admin Only):
  - **Resolve Dispute** (`btn-resolve`): Marks dispute valid, initiating audit recalculation.
  - **Dismiss Dispute** (`btn-dismiss`): Submits on-chain `dismiss_dispute` transaction to unfreeze vault.
- **Accessibility & Keyboard Navigation**:
  - Modal traps focus with `role="dialog"` and `aria-modal="true"`.
  - Dismissible via standard `Escape` keyboard shortcut.

---

## 5. Security & Griefing Mitigations
1. **Window Bounding**: Challenges can only be submitted during active dispute windows, preventing delayed griefing attacks.
2. **Single Challenge per Participant**: Contract enforces `Error::DisputeAlreadySubmitted` preventing spam flooding.
3. **Admin Dismissal Bypass**: The tournament creator or platform administrator can promptly dismiss malicious disputes.
4. **On-Chain Audit Trails**: All dispute events (`dispute`, `submit`, `resolve`, `dismis`) are emitted on Stellar ledgers with full payload hashes.
