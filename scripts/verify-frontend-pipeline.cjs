#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('==============================================');
console.log('Stellar Splash Frontend Pipeline Audit');
console.log('==============================================');

function run(cmd, desc) {
  console.log(`\n▶ Running ${desc}...`);
  execSync(cmd, { stdio: 'inherit' });
}

try {
  run('npm run typecheck', 'TypeScript Typecheck');
  run('node scripts/check-accessibility.cjs', 'Accessibility Linting');
  run('node scripts/verify-stellar-expert-links.cjs', 'StellarExpert Links Audit');
  console.log('\n==============================================');
  console.log('✅ All frontend pipeline checks passed cleanly!');
  console.log('==============================================');
} catch (err) {
  console.error('\n❌ Pipeline check failed:', err.message);
  process.exit(1);
}

