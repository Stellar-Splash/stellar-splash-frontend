# Stellar Splash - Production Launch Readiness Checklist

## 1. Smart Contract Verification & Mainnet Migration
- [x] Protocol 21/22 storage TTL persistence tested (`bump_persistent`).
- [x] Zero-deficit basis points payout invariant proven formally.
- [x] Emergency pause and admin timelock validated.
- [ ] Multisig / Threshold signing key configuration for Mainnet Admin.
- [ ] Third-party formal security audit report published.

## 2. Infrastructure & Settlement Engine
- [x] Channel account liquidity pool initialized and auto-funded.
- [x] Soroban RPC circuit breaker with secondary fallback endpoint configured.
- [x] Prometheus metrics exporter configured on port 9090.
- [x] Automated load test validated up to 5,000 synthetic replay submissions.
- [ ] Multi-region geographic load balancer deployment.

## 3. Frontend & User Experience
- [x] Multi-wallet adapter tested with Freighter, Lobstr, and sandbox fallback.
- [x] High-DPI canvas DPR scaling and GC particle pooling verified.
- [x] Lighthouse accessibility (a11y) score $> 95$.
- [x] Production bundle chunk budget enforced ($< 500\text{ KB}$).
- [x] SPA router fallback configured in `nginx.conf`.

