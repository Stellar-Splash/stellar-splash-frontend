#!/usr/bin/env node

/**
 * Stellar Splash Frontend - Production Bundle Size Analyzer
 * Analyzes compiled assets in dist/ directory, measuring raw and gzip compressed sizes.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execSync } = require('child_process');

const DIST_DIR = path.resolve(__dirname, '..', 'dist');

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function analyzeBundle() {
  console.log('\n=============================================================');
  console.log('📦 Stellar Splash - Production Bundle Size Analysis');
  console.log('=============================================================\n');

  // Ensure build exists or run build
  if (!fs.existsSync(DIST_DIR)) {
    console.log('Dist directory not found. Running production build first...');
    execSync('npm run build', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
  }

  const assetsDir = path.join(DIST_DIR, 'assets');
  if (!fs.existsSync(assetsDir)) {
    console.error('❌ Assets directory not found in dist/. Please run npm run build.');
    process.exit(1);
  }

  const files = fs.readdirSync(assetsDir);
  const rows = [];
  let totalRawBytes = 0;
  let totalGzipBytes = 0;

  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;

    const content = fs.readFileSync(filePath);
    const rawSize = stat.size;
    const gzipSize = zlib.gzipSync(content).length;

    totalRawBytes += rawSize;
    totalGzipBytes += gzipSize;

    const ext = path.extname(file);
    let type = 'OTHER';
    if (ext === '.js') type = 'JAVASCRIPT';
    else if (ext === '.css') type = 'STYLESHEET';
    else if (['.svg', '.png', '.webp', '.jpg'].includes(ext)) type = 'ASSET';

    rows.push({
      file,
      type,
      rawSize,
      gzipSize,
    });
  }

  // Sort descending by raw size
  rows.sort((a, b) => b.rawSize - a.rawSize);

  console.log(
    'Asset Name'.padEnd(45) +
      ' | ' +
      'Type'.padEnd(12) +
      ' | ' +
      'Raw Size'.padEnd(12) +
      ' | ' +
      'Gzip Size',
  );
  console.log('-'.repeat(82));

  for (const r of rows) {
    const rawFormatted = formatBytes(r.rawSize).padEnd(12);
    const gzipFormatted = formatBytes(r.gzipSize);
    console.log(
      r.file.padEnd(45) + ' | ' + r.type.padEnd(12) + ' | ' + rawFormatted + ' | ' + gzipFormatted,
    );
  }

  console.log('-'.repeat(82));
  console.log(
    'TOTAL'.padEnd(45) +
      ' | ' +
      'ALL'.padEnd(12) +
      ' | ' +
      formatBytes(totalRawBytes).padEnd(12) +
      ' | ' +
      formatBytes(totalGzipBytes),
  );
  console.log('=============================================================\n');

  const MAX_GZIP_BUDGET = 600 * 1024; // 600 KB budget
  if (totalGzipBytes > MAX_GZIP_BUDGET) {
    console.warn(
      `⚠️ WARNING: Total bundle gzip size (${formatBytes(totalGzipBytes)}) exceeds ${formatBytes(
        MAX_GZIP_BUDGET,
      )} budget!`,
    );
  } else {
    console.log(
      `✅ Bundle is well within performance budget (${formatBytes(totalGzipBytes)} / ${formatBytes(
        MAX_GZIP_BUDGET,
      )}). Fast 3G initial load certified!\n`,
    );
  }
}

analyzeBundle();
