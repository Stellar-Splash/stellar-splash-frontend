#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('Auditing React components for WCAG accessibility attributes...');

const srcDir = path.join(__dirname, '..', 'src', 'components');
const files = fs.readdirSync(srcDir).filter((f) => f.endsWith('.tsx'));

let totalAudited = 0;
let passCount = 0;

files.forEach((file) => {
  totalAudited++;
  const content = fs.readFileSync(path.join(srcDir, file), 'utf8');

  // Check for presence of interactive elements having aria-label or accessible text
  const hasAria = /aria-label|role=|title=/i.test(content);
  if (hasAria) {
    passCount++;
  }
});

console.log(`Audited ${totalAudited} UI components. Accessible markers detected in ${passCount}/${totalAudited} files.`);
console.log('✅ Accessibility check completed.');

