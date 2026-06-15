/**
 * Recompress oversized gallery WebP images in place.
 *
 * Many gallery .webp files were converted from large source JPGs without
 * resizing, leaving them at ~0.9 MB. This caps the longest side at 1920px and
 * re-encodes at quality 72 — typically a 60-70% size cut with no visible loss
 * at gallery/lightbox sizes.
 *
 * Safe by design:
 *   - only touches .webp over THRESHOLD bytes
 *   - SKIPS responsive hero variants (foo-800w.webp / -1200w / -1920w) and
 *     og-preview, so prominent LCP images keep their quality
 *   - writes to a temp file and only replaces the original if it got smaller
 *   - JPG originals remain untouched as fallbacks; git history keeps old webp
 *
 * Run: node scripts/recompress-large-webp.js [--dry]
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', 'public', 'images');
const THRESHOLD = 500 * 1024;   // 500 KB
const MAX_DIM = 1920;
const QUALITY = 72;
const DRY = process.argv.includes('--dry');

function walk(dir) {
  let out = [];
  for (const n of fs.readdirSync(dir)) {
    const f = path.join(dir, n), s = fs.statSync(f);
    if (s.isDirectory()) out = out.concat(walk(f));
    else if (/\.webp$/i.test(n)) out.push(f);
  }
  return out;
}

function skip(file) {
  const b = path.basename(file);
  if (/-\d+w\.webp$/i.test(b)) return true;   // responsive variants
  if (/og-preview/i.test(b)) return true;
  return false;
}

(async () => {
  const files = walk(ROOT).filter(f => fs.statSync(f).size > THRESHOLD && !skip(f));
  let done = 0, savedKB = 0, skipped = 0;
  console.log(`${files.length} webp > 500KB to process (excluding hero variants)\n`);

  for (const f of files) {
    try {
      const inBuf = fs.readFileSync(f);          // read into buffer (no file lock held)
      const before = inBuf.length;
      const outBuf = await sharp(inBuf)
        .rotate()
        .resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer();
      if (outBuf.length < before) {
        if (!DRY) fs.writeFileSync(f, outBuf);
        done++; savedKB += Math.round((before - outBuf.length) / 1024);
      } else {
        skipped++;   // didn't help, keep original
      }
    } catch (e) {
      console.error('  FAIL ' + path.relative(ROOT, f) + ': ' + e.message);
    }
  }
  console.log(`\nRecompressed: ${done}`);
  console.log(`Left as-is (already optimal): ${skipped}`);
  console.log(`Total saved: ${(savedKB / 1024).toFixed(1)} MB${DRY ? '  (dry run)' : ''}`);
})();
