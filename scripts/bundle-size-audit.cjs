#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

console.log('Auditing Vite production bundle chunk sizes...');

const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  console.log('Dist directory not found; run npm run build first.');
  process.exit(0);
}

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getFiles(distDir);
let maxGzipKb = 0;

files.forEach((file) => {
  if (file.endsWith('.js') || file.endsWith('.css')) {
    const content = fs.readFileSync(file);
    const gzipped = zlib.gzipSync(content);
    const sizeKb = Math.round((gzipped.length / 1024) * 100) / 100;
    const relPath = path.relative(distDir, file);
    console.log(`  - ${relPath}: ${sizeKb} KB (gzipped)`);
    if (sizeKb > maxGzipKb) maxGzipKb = sizeKb;
  }
});

console.log(`Maximum chunk size: ${maxGzipKb} KB (gzipped)`);

if (maxGzipKb > 500) {
  console.error('❌ Error: Chunk size exceeded 500 KB limit.');
  process.exit(1);
}

console.log('✅ Bundle chunk sizes within acceptable performance thresholds (< 500 KB).');
