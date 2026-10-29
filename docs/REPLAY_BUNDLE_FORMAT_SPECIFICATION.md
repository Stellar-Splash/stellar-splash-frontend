# Stellar Splash Frontend: Replay Bundle Format Specification

## 1. Overview
The Verifiable Match Replay Bundle format is an open, cryptographically verifiable JSON serialization standard that captures every deterministic tick, user action, and score event in a Stellar Splash tournament match.

Replay bundles are produced client-side via `ReplayExportButton.tsx` and ingested/verified by the backend engine (`ReplayBundleValidationService.ts`) to validate on-chain attestations or resolve challenge disputes.

---

## 2. JSON Specification Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "StellarSplashReplayBundle",
  "type": "object",
  "required": [
    "version",
    "matchId",
    "tournamentId",
    "players",
    "finalScores",
    "stateRootSha256",
    "ticks",
    "timestamp"
  ],
  "properties": {
    "version": { "type": "string", "example": "1.0.0" },
    "matchId": { "type": "string", "example": "match-9801" },
    "tournamentId": { "type": "string", "example": "101" },
    "players": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 1
    },
    "finalScores": {
      "type": "object",
      "additionalProperties": { "type": "integer" }
    },
    "scoreSummaries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "playerAddress": { "type": "string" },
          "score": { "type": "integer" },
          "rank": { "type": "integer" },
          "hitsDealt": { "type": "integer" },
          "hitsReceived": { "type": "integer" },
          "waterBalloonsThrown": { "type": "integer" }
        }
      }
    },
    "stateRootSha256": {
      "type": "string",
      "pattern": "^[0-9a-fA-F]{64}$"
    },
    "ticks": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["tickIndex", "playerIndex", "action", "timestamp"],
        "properties": {
          "tickIndex": { "type": "integer" },
          "playerIndex": { "type": "integer" },
          "action": { "type": "string" },
          "payload": { "type": "object" },
          "timestamp": { "type": "integer" }
        }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "engineVersion": { "type": "string" },
        "gameId": { "type": "string" },
        "seed": { "type": "integer" },
        "durationMs": { "type": "integer" },
        "clientUserAgent": { "type": "string" },
        "recordingCompletedAt": { "type": "integer" }
      }
    },
    "timestamp": { "type": "integer" }
  }
}
```

---

## 3. Deterministic SHA-256 State Root Calculation

To prevent tampering and ensure verifiable parity between the frontend game simulation and backend settlement:

1. Extract `matchId`, `tournamentId`, sorted array of `players`, and normalized array of `ticks`.
2. Format into canonical JSON (consistent key ordering without extraneous whitespace):
   ```json
   {"matchId":"...","players":["..."],"ticks":[{"action":"...","payload":{},"playerIndex":0,"tickIndex":0}],"tournamentId":"..."}
   ```
3. Compute cryptographic digest:
   $$\text{stateRootSha256} = \text{SHA-256}(\text{Canonical JSON})$$
4. The resulting 64-character lowercase hex digest is committed to the bundle and verified prior to generating ranking agreements.

---

## 4. Dispute Challenge Integration

During the on-chain dispute window (`MIN_DISPUTE_WINDOW_SECONDS = 300` / 5 minutes), any player or observer may challenge a reported match result:

1. The challenger exports the official replay bundle using the **"Export Replay"** button.
2. The challenger submits `submit_dispute(env, challenger, tournament_id, reason_code)` on Soroban.
3. The decentralized verification engine loads the bundle, executes a headless replay simulation from tick 0 to completion, and computes the canonical state root.
4. If the simulation yields a diverging state root or final score, the dispute is confirmed and unauthorized payouts are aborted.
