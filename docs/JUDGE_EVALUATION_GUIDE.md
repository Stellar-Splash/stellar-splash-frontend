# Stellar Splash - Hackathon Judge Evaluation Guide

Welcome Judges! This guide allows you to test and audit every layer of Stellar Splash within **5 minutes**.

---

## ⚡ Quick Links & Contract Addresses
- **Testnet Contract**: [`CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ`](https://stellar.expert/explorer/testnet/contract/CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ)
- **Admin Public Key**: [`GCQ3OLBMJUGWN3PHYE3SDIKKIPVLJSFFWG4Q4CEABGHWGBEBPBKMY6OW`](https://stellar.expert/explorer/testnet/account/GCQ3OLBMJUGWN3PHYE3SDIKKIPVLJSFFWG4Q4CEABGHWGBEBPBKMY6OW)
- **Soroban Network**: Stellar Testnet (Protocol 21)

---

## 🎯 5-Minute Evaluation Flow

### Step 1: Instant Judge Onboarding (No Wallet Required)
1. Open the frontend web app.
2. If you do not have Freighter installed, click **"Sandbox Demo Mode"** in the top navigation bar.
3. If you have Freighter installed, click **"Fund with Friendbot"** to immediately receive 10,000 Testnet XLM.

### Step 2: Play a Tournament Match
1. Select **Tournament #101 (Stellar Testnet Splashdown Cup)**.
2. Click **"Register & Play"** (Signs entry fee transaction on Soroban).
3. Play the 60Hz canvas game using **Arrow Keys / WASD** or the on-screen **Touch Gamepad**.
4. Dodge obstacles, collect Stellar XLM orbs, and finish your run.

### Step 3: Observe Deterministic Replay Verification
1. Notice the **Live Verification Stepper** in the settlement drawer.
2. The engine verifies input tick entropy, validates physics bounds, and attests the score.
3. Open the **Replay Scrubber** to inspect frame-by-frame physics inputs and velocity vectors.

### Step 4: Verify Solvency & Smart Contract Payouts
1. Click **"Solvency Audit"** in the header.
2. Inspect the live comparison of Contract Vault balance vs. Active Tournament Liabilities.
3. Click any transaction hash to view the verified execution on **StellarExpert**.

### Step 5: Check Anti-Cheat Dispute Arbitration
1. Navigate to `/arbitration` or click **"Dispute Settlement"**.
2. Review the simulated cryptographic proof bundle, including SHA-256 tick hash and Shannon entropy score ($H = 2.45$).

