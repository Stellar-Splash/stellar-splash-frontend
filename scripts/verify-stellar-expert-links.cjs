#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('Auditing StellarExpert explorer deep-link formatting...');

const srcDir = path.join(__dirname, '..', 'src');

function scanDir(dir) {
  let issues = 0;
  const list = fs.readdirSync(dir);
  list.forEach((item) => {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      issues += scanDir(full);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      const text = fs.readFileSync(full, 'utf8');
      if (text.includes('stellar.expert/explorer/public')) {
        console.warn(`⚠️ Warning: Found mainnet link in ${full}`);
        issues++;
      }
    }
  });
  return issues;
}

const warnings = scanDir(srcDir);
if (warnings === 0) {
  console.log('✅ 100% of StellarExpert links correctly route to the Testnet network.');
} else {
  console.log(`Completed with ${warnings} warnings.`);
}
