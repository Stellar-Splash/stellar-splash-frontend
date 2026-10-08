const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = path.resolve(__dirname, '..', '..', 'docs', 'images');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  console.log('Launching Edge for product screenshots...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });

  // 1. Arena & Tournament Discovery
  console.log('Navigating to http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise((r) => setTimeout(r, 2000));

  console.log('Capturing 01_arena_discovery.png...');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_arena_discovery.png'), fullPage: false });

  // 2. Splash Rush Gameplay Arena
  console.log('Navigating to Splash Rush Game view...');
  // Click Play Tab or Play button
  const playButtons = await page.$$('button');
  for (const btn of playButtons) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('Play Splash Rush')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));
  console.log('Capturing 02_splash_rush_game.png...');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_splash_rush_game.png') });

  // Return to Tournaments
  const tabButtons = await page.$$('button');
  for (const btn of tabButtons) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('Tournaments')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));

  // 3. Prize Agreement Modal
  console.log('Opening Prize Agreement modal...');
  const agreementBtn = await page.$('button[title="Prize Agreement & Financial Rules"]');
  if (agreementBtn) {
    await agreementBtn.click();
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Capturing 03_prize_agreement.png...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '03_prize_agreement.png') });
  }

  // 4. Standings & Ranking Hash Modal
  console.log('Reloading to open Tournament Standings modal...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1000));
  const rankingBtn = await page.$('button[title="Verified Tournament Standings"]');
  if (rankingBtn) {
    await rankingBtn.click();
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Capturing 04_verified_standings.png...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '04_verified_standings.png') });
  }

  // 5. Deterministic Prize Settlement Modal
  console.log('Reloading to open Deterministic Prize Settlement modal...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1000));
  const settleBtn = await page.$('button[title="Deterministic Prize Settlement & Payouts"]');
  if (settleBtn) {
    await settleBtn.click();
    await new Promise((r) => setTimeout(r, 1500));
    console.log('Capturing 05_deterministic_settlement.png...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '05_deterministic_settlement.png') });
  }

  // 6. Connect wallet & Player Payout History Modal
  console.log('Connecting wallet via localStorage and opening My Payouts...');
  await page.evaluate(() => {
    localStorage.setItem(
      'stellar_splash_wallet',
      JSON.stringify({
        publicKey: 'GA7QYXF6M75J2A54NXW347A2MHKX3N6LKYP2L3KV3Q7T5M8W9P0X1TEST',
        balanceXLM: 9850.5,
        isEphemeral: false,
      })
    );
  });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1500));

  // Look for My Payouts button
  let payoutsBtn = await page.$('button[title="View Player Payout History & Receipts"]');
  if (!payoutsBtn) {
    const allBtns = await page.$$('button');
    for (const b of allBtns) {
      const txt = await page.evaluate((el) => el.innerText, b);
      if (txt && txt.includes('My Payouts')) {
        payoutsBtn = b;
        break;
      }
    }
  }

  if (payoutsBtn) {
    console.log('Clicking My Payouts button...');
    await payoutsBtn.click();
    await new Promise((r) => setTimeout(r, 1500));
    console.log('Capturing 06_player_payout_history.png...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '06_player_payout_history.png') });
  } else {
    console.log('Warning: My Payouts button still not visible.');
  }

  await browser.close();
  console.log('✅ All screenshots captured successfully in docs/images!');
}

run().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
