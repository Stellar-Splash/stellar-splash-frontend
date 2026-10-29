# Stellar Splash - Hackathon Video Demo Script (3-Minute Walkthrough)

## Video Overview
- **Length**: 3 Minutes (180 Seconds)
- **Presenter**: Developer / Creator
- **Tone**: Fast-paced, punchy, technically rigorous, judge-friendly.

---

## Storyboard & Voiceover Narration

### [0:00 - 0:30] Hook & The Problem
- **Visual**: Title card with logo, followed by live web app at [stellar-splash.netlify.app](https://stellar-splash.netlify.app).
- **Voiceover**:
  > "Hi judges! Welcome to Stellar Splash — where competitive gaming meets the speed and low cost of Stellar and Soroban. Today's Web3 games have a huge dilemma: run everything on-chain and your game is unplayable due to latency and gas; or run off-chain and players cheat with bots and hacked memory. Stellar Splash solves both with 60Hz deterministic physics simulation and trustless Soroban smart contract settlements."

---

### [0:30 - 1:15] Zero-Friction Onboarding & Live Gameplay
- **Visual**: Clicking "Fund with Friendbot", instant 10,000 XLM balance update, selecting Tournament #101, and launching Splash Rush canvas match.
- **Voiceover**:
  > "Watch how fast onboarding is. With one click, Friendbot funds our testnet wallet. We enter Tournament #101 with a signed Soroban transaction that locks our entry fee directly in the contract vault at `CACHWJEZY...7QYJ`. Now we're in the 60 FPS canvas game. The physics engine runs at a fixed 60Hz step with a seeded PRNG tied to the Stellar ledger sequence. Every jump, dodge, and point collected is recorded as an immutable input delta stream."

---

### [1:15 - 2:00] Deterministic Anti-Cheat & Replay Scrubber
- **Visual**: Game finishes. Replay verification drawer opens with live stepper. Opening the interactive Replay Scrubber to show frame-by-frame physics and Shannon entropy ($H=2.45$).
- **Voiceover**:
  > "When the match finishes, our backend engine re-simulates the run headlessly. It checks velocity envelopes, collision hitboxes, and measures Shannon movement entropy to instantly weed out linear bot macros. Once attested, the engine hashes the replay and prepares the settlement transaction."

---

### [2:00 - 2:35] Channel Accounts & Provable Solvency
- **Visual**: Showing the Solvency Audit modal (Vault Reserves vs. Liabilities) and opening StellarExpert deep links for batch settlement.
- **Voiceover**:
  > "To avoid sequence number collisions, our engine uses a pool of Stellar Channel Accounts to disburse multi-winner payouts simultaneously without `txBAD_SEQ` errors. Look at our Solvency Audit modal: judges can verify in real time that vault reserves strictly equal or exceed liabilities down to the stroop, with zero token deficit."

---

### [2:35 - 3:00] Conclusion & Stellar Impact
- **Visual**: Showing Soulbound Token champion badge, GitHub organization with 300 improvements, and closing slide.
- **Voiceover**:
  > "Winners receive their XLM instantly plus a non-transferable Soulbound Token badge minted on Soroban. Stellar Splash brings high-frequency competitive esports to Stellar with zero latency and full on-chain trust. Try the live demo today! Thank you!"

