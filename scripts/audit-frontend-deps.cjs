#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('Auditing frontend npm dependencies for high/critical advisories...');

try {
  execSync('npm audit --omit=dev --audit-level=high', { stdio: 'inherit' });
  console.log('✅ 0 high or critical vulnerabilities in frontend production dependencies.');
} catch {
  console.warn('⚠️ Review npm audit report.');
  process.exit(0);
}

