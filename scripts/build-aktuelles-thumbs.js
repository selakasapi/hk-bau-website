/**
 * Generate small strip-thumbnail variants for each aktuelles gallery image.
 *
 * The post-page gallery thumbnail strip displays each thumb at 76x56 px but
 * was downloading the full-size 200-450 KB image. This script generates
 * <base>-thumb.webp at 200x140 (sharp on retina, ~5-15 KB) for every JPG/WebP
 * in public/images/aktuelles/.
 *
 * Run: node scripts/build-aktuelles-thumbs.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC_DIR = path.join(__dirname, '..', 'public', 'images', 'aktuelles');
const WIDTH = 200;
const HEIGHT = 140;
const QUALITY = 78;

async function makeThumb(src) {
  const ext = path.extname(src).toLowerCase();
  if (!/\.jpe?g$/.test(ext)) return null; // start from JPG sources
  const base = path.basename(src, ext);
  const dst = path.join(SRC_DIR, `${base}-thumb.webp`);
  if (fs.existsSync(dst)) return { skipped: true };
  await sharp(src).rotate().resize({ width: WIDTH, height: HEIGHT, fit: 'cover' }).webp({ quality: QUALITY }).toFile(dst);
  const size = fs.statSync(dst).size;
  return { dst, size };
}

(async () => {
  const files = fs.readdirSync(SRC_DIR).map(n => path.join(SRC_DIR, n));
  let made = 0, skipped = 0, totalKB = 0;
  for (const f of files) {
    const r = await makeThumb(f);
    if (!r) continue;
    if (r.skipped) { skipped++; continue; }
    made++;
    totalKB += Math.round(r.size / 1024);
    console.log(`  ${path.basename(r.dst)} (${Math.round(r.size / 1024)} KB)`);
  }
  console.log(`\nGenerated ${made} thumbs (${totalKB} KB total), skipped ${skipped} already existing.`);
})();
