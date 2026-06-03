/**
 * Generate small strip-thumbnail variants for each aktuelles gallery image.
 *
 * The post-page gallery thumbnail strip displays each thumb at 76x56 px but
 * was downloading the full-size 200-450 KB image. This script generates
 * <base>-thumb.webp at 200x140 (sharp on retina, ~5-15 KB) for every JPG
 * under public/images/aktuelles/ (recurses into per-post subfolders).
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

/* Recursively collect all JPG files (skips already-derived -thumb files implicitly
   since they are .webp). */
function walkJpgs(dir) {
  let out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) out = out.concat(walkJpgs(full));
    else if (/\.jpe?g$/i.test(name)) out.push(full);
  }
  return out;
}

async function makeThumb(src) {
  const ext = path.extname(src);
  const dst = src.slice(0, -ext.length) + '-thumb.webp'; // sibling, same folder
  if (fs.existsSync(dst)) return { skipped: true };
  await sharp(src).rotate().resize({ width: WIDTH, height: HEIGHT, fit: 'cover' }).webp({ quality: QUALITY }).toFile(dst);
  return { dst, size: fs.statSync(dst).size };
}

(async () => {
  const files = walkJpgs(SRC_DIR);
  let made = 0, skipped = 0, totalKB = 0;
  for (const f of files) {
    const r = await makeThumb(f);
    if (r.skipped) { skipped++; continue; }
    made++;
    totalKB += Math.round(r.size / 1024);
    console.log(`  ${path.relative(SRC_DIR, r.dst)} (${Math.round(r.size / 1024)} KB)`);
  }
  console.log(`\nGenerated ${made} thumbs (${totalKB} KB total), skipped ${skipped} already existing.`);
})();
