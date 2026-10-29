# 🌊 Stellar Splash: Player Onboarding & Setup Guide

Welcome to **Stellar Splash**, the high-octane competitive web3 arcade experience powered by **Soroban Smart Contracts** on the **Stellar Testnet**!

This comprehensive onboarding guide walks you step-by-step through installing the Freighter wallet, funding testnet tokens, connecting to the decentralized game client, participating in tournaments, and receiving non-custodial payouts.

---

## 📋 System Prerequisites

To play Stellar Splash, you need:
- **Web Browser**: Google Chrome, Brave, Mozilla Firefox, or Microsoft Edge.
- **Freighter Wallet Extension**: The official, non-custodial browser wallet for the Stellar network.
- **Hardware**: Any modern desktop, laptop, or tablet with pointer or touchscreen input.

---

## 🛠️ Step 1: Install the Freighter Wallet

Stellar Splash interacts directly with the Stellar blockchain through the **Freighter** browser extension. Freighter securely signs game transactions and prize claims without exposing your private keys.

1. Navigate to the official Freighter website: [https://www.freighter.app/](https://www.freighter.app/)
2. Click **Install Extension** and select your browser (Chrome Web Store or Firefox Add-ons).
3. Once installed, pin the Freighter icon to your browser toolbar for easy access.
4. Open Freighter and click **Create Wallet**.
5. Set a strong password and **securely write down your 24-word recovery phrase**. Store it in a secure location offline.

---

## 🌐 Step 2: Switch Network to Stellar Testnet

Stellar Splash is currently deployed and live on **Stellar Testnet**. You must configure Freighter to point to Testnet:

1. Click the **Freighter** extension icon in your browser.
2. Click the **Gear (Settings)** icon in the top-right corner.
3. Select **Preferences** > **Network**.
4. Change the active network dropdown from `PUBLIC` to **`TESTNET`**.
5. Verify the network parameters:
   - **Network Name**: `Test SDF Network`
   - **Network Passphrase**: `Test SDF Network ; September 2015`
   - **RPC Endpoint**: `https://soroban-testnet.stellar.org`
   - **Horizon Endpoint**: `https://horizon-testnet.stellar.org`

---

## 💰 Step 3: Fund Your Wallet with Free Testnet XLM

To pay nominal transaction gas fees and participate in tournaments, you need Testnet XLM. You can fund your address with 10,000 free test tokens in seconds via **Stellar Friendbot**:

### Option A: Via Freighter Built-In Faucet
1. Open Freighter on the Testnet network.
2. If your balance shows `0 XLM`, click **Fund Account** or **Get Testnet Lumens**.
3. Freighter will automatically trigger the Stellar Friendbot API.

### Option B: Via Stellar Laboratory
1. Copy your public key from Freighter (starts with `G...`, 56 characters).
2. Visit the [Stellar Laboratory Account Creator](https://laboratory.stellar.org/#account-creator?network=test).
3. Paste your public address into the **Friendbot: Get test network lumens** input box.
4. Click **Get test network lumens**.
5. Verify in Freighter that your balance updates to `10,000.0000000 XLM`.

---

## 🎮 Step 4: Launch and Connect to Stellar Splash

1. Start your local development server or open the live deployment URL:
   ```bash
   npm run dev
   ```
2. Navigate to `http://localhost:5173/` in your browser.
3. In the top navigation bar, click the **Connect Wallet** button.
4. Freighter will display a permission modal requesting read access to your public key:
   - **Origin**: `http://localhost:5173`
   - **Access**: Read public key and submit sign requests.
5. Click **Approve**. Your wallet address will now display in the header (e.g., `GA2C...7QYJ`) alongside your live XLM balance.

---

## 🏆 Step 5: Joining or Hosting Tournaments

Stellar Splash organizes competitive play into time-bounded tournaments governed by smart contracts:

1. **Browse Tournaments**: Browse the dashboard to see active, upcoming, and finalized tournaments.
2. **Review Prize Agreements**:
   - Each tournament displays its prize pool, sponsor vault, and basis-point payout structure (e.g. 5,000 bps = 50% for 1st place, 3,000 bps = 30% for 2nd place, 2,000 bps = 20% for 3rd place).
3. **Register / Enter**:
   - Click **Join Tournament**.
   - If an entry fee is required, Freighter will prompt you to authorize the transfer into the Soroban escrow vault:
     `CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ`.
   - Click **Approve** in Freighter to finalize registration on-chain.

---

## 🎯 Step 6: Playing "Splash Rush" & Anti-Cheat Mechanics

1. Once registered, click **Play Match**.
2. **Game Rules**:
   - High-velocity water balloons will spawn across the interactive canvas.
   - Pop balloons by clicking or tapping them before they submerge or burst.
   - Chaining consecutive pops activates **Combo Multipliers** (1.5x up to 4.0x score boost).
   - Beware of hazard bombs that drain your splash meter!
3. **Cryptographic Replay Attestation**:
   - Stellar Splash utilizes a deterministic replay engine. Every click event records an exact timestamp, coordinate geometry, and target ID.
   - Upon match completion, the client compiles your telemetry into an attestation payload signed with HMAC-SHA256.
   - The backend engine (`stellar-splash-engine`) executes a full frame-by-frame verification of your telemetry before registering your score on the leaderboard.
   - Exploitative macro clicks (<40ms interval), impossible boundary taps, and synthetic time-skewing are automatically rejected.

---

## 💸 Step 7: Tournament Settlement & Payout Claims

1. When the tournament countdown timer reaches `00:00:00`, the tournament transitions to `FINALIZED`.
2. The backend engine compiles the canonical leaderboard, verifies all match hashes, and generates a cryptographic settlement authorization payload.
3. The tournament organizer or winner triggers **Execute Settlement** via the on-chain Soroban contract method `execute_settlement`.
4. The smart contract validates:
   - Ranking hash matches the attested engine fingerprint.
   - Prize agreement basis points sum strictly to 10,000 bps (100%).
   - Contract escrow balance is sufficient to satisfy all payouts.
5. The contract atomically distributes prize tokens directly to each winner's Stellar public key in a single transaction.
6. Open Freighter to see your winnings instantly reflected in your wallet balance!

---

## 🔍 Step 8: Verifying Transactions on Stellar Expert

Every action on Stellar Splash is completely auditable and transparent on the public Stellar Testnet ledger:

- **Contract Explorer**: [Stellar Expert Testnet Contract](https://stellar.expert/explorer/testnet/contract/CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ)
- **Account Explorer**: Search your `G...` public address on [Stellar Expert Testnet](https://stellar.expert/explorer/testnet/) to view:
  - Contract invocation traces.
  - SAC Token balance transfers.
  - Soroban ledger storage modifications.

---

## ❓ Frequently Asked Questions & Troubleshooting

### Q: Why does Freighter say "Extension Not Found"?
**A**: Ensure Freighter is enabled in your browser extensions manager (`chrome://extensions`). If using Brave, disable "Brave Wallet" interception in settings.

### Q: What should I do if my transaction fails with "tx_bad_seq"?
**A**: This occurs when multiple transactions are submitted in rapid succession before the previous ledger closes (ledgers close every ~5 seconds on Stellar). Wait 5 seconds and retry.

### Q: Are my funds safe in the tournament vault?
**A**: Yes! The Soroban contract vault is non-custodial and open-source. Funds deposited for prize pools can only be withdrawn according to the verified prize agreement rules signed by the tournament participants and engine attestors.

---

Happy splashing! 🌊🎯
