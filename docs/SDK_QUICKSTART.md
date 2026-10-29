# Stellar Splash Client SDK - Integration Quickstart

The `@stellar-splash/client-sdk` allows game developers, bots, and analytics tools to integrate seamlessly with Stellar Splash Soroban contracts and backend verification nodes.

---

## 📦 Installation & Setup

```typescript
import { 
  SplashContractClient, 
  ReplayValidator, 
  SolvencyAuditor, 
  FriendbotClient 
} from './sdk';

// 1. Initialize Contract Client targeting Stellar Testnet
const client = new SplashContractClient({
  network: 'testnet',
  contractId: 'CACHWJEZY6JN36VFACWRQ7FP4T5EPRRRNBVLOSFHXTJHETZY36JD7QYJ',
  rpcUrl: 'https://soroban-testnet.stellar.org',
  horizonUrl: 'https://horizon-testnet.stellar.org'
});
```

---

## 🎮 Interacting with Tournaments

### Fetch Tournament Metadata
```typescript
const tournament = await client.getTournament(101);
console.log(`Tournament #${tournament.id} Status: ${tournament.status}`);
console.log(`Prize Pool: ${tournament.prizePoolXlm} XLM`);
```

### Validate a Gameplay Run Client-Side
```typescript
const playerInputs = [2, 4, 1, 3, 2, 4, 1, 3, 2, 4, 1, 3];
const result = ReplayValidator.verifyRun(playerInputs, 4200);

if (result.valid) {
  console.log(`Valid run! Score: ${result.score}, Shannon Entropy: ${result.entropy}`);
} else {
  console.error(`Verification rejected: ${result.reason}`);
}
```

### Check Vault Solvency
```typescript
const audit = SolvencyAuditor.verifySolvency(5000, 4800);
console.log(`Solvent: ${audit.isSolvent}, Surplus: +${audit.deltaXlm} XLM`);
```

