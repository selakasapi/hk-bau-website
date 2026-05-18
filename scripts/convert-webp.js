/**
 * Convert all JPGs under public/images/ to WebP (skips if .webp already exists).
 *
 * Usage:
 *   node scripts/convert-webp.js                    # convert everything new
 *   node scripts/convert-webp.js --force            # re-convert even if .webp exists
 *   node scripts/convert-webp.js --dir <subdir>     # only inside public/images/<subdir>
 *   node scripts/convert-webp.js --hero             # also generate responsive sizes
 *                                                     for images/projekten/*hero* and
 *                                                     images/aktuelles/*hero* style files
 *
 * Sharp quality 82 = ~50–60% size reduction vs source JPG with no visible loss.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', 'public', 'images');
const QUALITY = 82;
const RESPONSIVE_WIDTHS = [480, 800, 1200, 1920];

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const RESPONSIVE_HERO = args.includes('--hero');
const DIR_IDX = args.indexOf('--dir');
const SUBDIR = DIR_IDX !== -1 ? args[DIR_IDX + 1] : null;

const stats = { converted: 0, skipped: 0, failed: 0, totalSavedKB: 0 };

function walk(dir) {
  let files = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walk(full));
    } else if (/\.(jpe?g|JPE?G)$/.test(name)) {
      files.push(full);
    }
  }
  return files;
}

async function convertOne(src) {
  const dst = src.replace(/\.(jpe?g|JPE?G)$/, '.webp');
  if (!FORCE && fs.existsSync(dst)) {
    stats.skipped++;
    return;
  }
  try {
    const srcSize = fs.statSync(src).size;
    await sharp(src).rotate().webp({ quality: QUALITY }).toFile(dst);
    const dstSize = fs.statSync(dst).size;
    stats.converted++;
    stats.totalSavedKB += Math.round((srcSize - dstSize) / 1024);
    process.stdout.write('.');
  } catch (e) {
    stats.failed++;
    console.error('\nFAILED:', src, e.message);
  }
}

async function makeResponsive(src) {
  const dir = path.dirname(src);
  const base = path.basename(src).replace(/\.(jpe?g|JPE?G)$/, '');
  for (const w of RESPONSIVE_WIDTHS) {
    const dst = path.join(dir, `${base}-${w}w.webp`);
    if (!FORCE && fs.existsSync(dst)) continue;
    try {
      await sharp(src).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(dst);
      console.log(`  responsive: ${path.relative(ROOT, dst)}`);
    } catch (e) {
      console.error('  responsive failed:', dst, e.message);
    }
  }
}

(async () => {
  const target = SUBDIR ? path.join(ROOT, SUBDIR) : ROOT;
  if (!fs.existsSync(target)) {
    console.error('Directory not found:', target);
    process.exit(1);
  }

  console.log(`Scanning ${target}...`);
  const files = walk(target);
  console.log(`Found ${files.length} JPG files.\n`);

  const CONCURRENCY = 4;
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    await Promise.all(files.slice(i, i + CONCURRENCY).map(convertOne));
  }
  console.log('');

  if (RESPONSIVE_HERO) {
    console.log('\nGenerating responsive sizes for hero candidates...');
    const HERO_PATTERNS = [
      /projekten[\\/]/,
      /aktuelles[\\/]2026/,
    ];
    for (const f of files) {
      if (HERO_PATTERNS.some(p => p.test(f))) {
        await makeResponsive(f);
      }
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Converted: ${stats.converted}`);
  console.log(`Skipped (already exist): ${stats.skipped}`);
  console.log(`Failed: ${stats.failed}`);
  console.log(`Total saved: ${(stats.totalSavedKB / 1024).toFixed(1)} MB`);
})();
