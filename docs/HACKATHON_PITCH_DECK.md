# 🌊 Stellar Splash - Hackathon Pitch Deck

> **"Skill-based arcade gaming powered by deterministic physics and trustless Soroban settlements on Stellar."**

---

## Slide 1: Cover
- **Project**: Stellar Splash
- **Tagline**: Play. Prove. Get Paid.
- **Track**: Gaming & Consumer dApps on Stellar / Soroban
- **Testnet Contract**: `CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ`
- **Live Demo**: [https://stellar-splash.netlify.app](https://stellar-splash.netlify.app)

---

## Slide 2: The Problem
1. **High Gas / Sluggish Gameplay**: Running full game loops on-chain creates lag and high fees, rendering action games unplayable.
2. **Cheating & Exploitation**: Off-chain games suffer from rampant client-side memory editing and bot manipulation.
3. **Onboarding Friction**: Mainstream players drop off when faced with complex wallet setups and gas funding steps.

---

## Slide 3: The Stellar Splash Solution
- **60Hz Off-Chain Deterministic Simulation**: Fixed-step Euler physics engine executes at 60 FPS in browser with seeded PRNG.
- **Serverless Anti-Cheat Attestation**: Headless backend re-simulates runs, enforces Shannon entropy thresholds ($H \ge 2.1$), and commits cryptographic score attestations.
- **Instant Non-Custodial Soroban Vault**: Protocol 21/22 contract handles non-custodial prize escrow, basis-points payouts, and Soulbound achievement badges.
- **Zero-Friction Onboarding**: 1-click Friendbot testnet funding and multi-wallet adapter (Freighter, Lobstr, Sandbox).

---

## Slide 4: Why Stellar & Soroban?
- **Sub-Cent Microtransactions**: Low transaction fees make $0.10 - $1.00 tournament entry fees viable.
- **Protocol 21/22 State Archiving**: Long-lived tournaments stay accessible via persistent storage TTL bumps without bloating state.
- **Channel Account Parallelism**: High-speed parallel settlements disburse multi-winner prizes simultaneously without sequence number conflicts.

---

## Slide 5: Business Model & Monetization
- **Platform Fee**: $2.5\%$ ($250\text{ bps}$) retained on settled tournament prize pools.
- **Creator Royalties**: Up to $15.0\%$ allocated to community tournament organizers and game studios.
- **Sponsored Tournaments**: Ecosystem grants and brand sponsors inject liquidity directly into public prize pools.

---

## Slide 6: Roadmap & Next Steps
- **Q1 2027**: Mainnet deployment on Stellar Protocol 22.
- **Q2 2027**: Mobile SDK for iOS/Android (Unity and Godot plugins).
- **Q3 2027**: Community tournament creator DAO with governance voting.

