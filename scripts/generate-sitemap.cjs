#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('Generating sitemap.xml...');

const BASE_URL = 'https://stellar-splash.org';
const routes = [
  '/',
  '/tournaments',
  '/leaderboard',
  '/replays',
  '/docs',
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${BASE_URL}${r}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${r === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outPath, sitemapXml, 'utf8');

console.log(`✅ Sitemap written to ${outPath}`);
