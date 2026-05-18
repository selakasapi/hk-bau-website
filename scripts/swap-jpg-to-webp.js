/**
 * For every <img src="...jpg"> in public/*.html, if the corresponding .webp
 * exists alongside it on disk, swap the src to .webp.
 *
 * Also swaps:
 *   - <link rel="preload" href="...jpg" as="image">
 *   - srcset attributes containing jpg URLs (if any)
 *
 * Skips:
 *   - external (http/https) URLs
 *   - Open Graph meta tags (og:image, twitter:image) — keep .jpg for max
 *     compatibility with Facebook/X crawlers that don't all support WebP
 *
 * Run:  node scripts/swap-jpg-to-webp.js [--dry]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public');
const DRY = process.argv.includes('--dry');

const stats = { filesTouched: 0, swapsApplied: 0, skipped: 0 };

function walk(dir) {
  let out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const s = fs.statSync(full);
    if (s.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      out = out.concat(walk(full));
    } else if (/\.html?$/i.test(name)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Decide whether a given JPG-ish URL (relative) has a .webp sibling on disk
 * relative to the HTML file's directory.
 */
function resolveWebpSibling(htmlDir, url) {
  // Skip external, data URIs, fragments, mailto
  if (/^(https?:|data:|mailto:|tel:|#)/i.test(url)) return null;
  // Skip URLs with query params or fragments (rare in img src, but defensive)
  const cleanUrl = url.split('?')[0].split('#')[0];
  if (!/\.(jpe?g)$/i.test(cleanUrl)) return null;
  const webpUrl = cleanUrl.replace(/\.(jpe?g)$/i, '.webp');
  const absJpg = path.resolve(htmlDir, cleanUrl);
  const absWebp = absJpg.replace(/\.(jpe?g)$/i, '.webp');
  if (!fs.existsSync(absWebp)) return null;
  // Preserve any query/hash from the original
  const tail = url.slice(cleanUrl.length);
  return webpUrl + tail;
}

function processFile(htmlPath) {
  const dir = path.dirname(htmlPath);
  let content = fs.readFileSync(htmlPath, 'utf8');
  const original = content;

  // Match img/source/link with src/href/srcset attributes containing jpg URLs.
  // Capture: opening tag prefix, attribute name, quote, url, quote, rest.
  // Conservative — one attribute at a time.
  const attrRegex = /(<(?:img|source|link)\b[^>]*?\b(?:src|href|srcset)\s*=\s*)(["'])([^"']+?\.jpe?g)(\2)/gi;

  content = content.replace(attrRegex, (match, prefix, q1, url, q2) => {
    // Skip og:image / twitter:image meta tags — those are <meta> not img/source/link, so already excluded by regex.
    // Also skip <link rel="preload" ...> for the OG image specifically — covered by og-preview.jpg living outside any folder.
    const swapped = resolveWebpSibling(dir, url);
    if (!swapped) { stats.skipped++; return match; }
    stats.swapsApplied++;
    return prefix + q1 + swapped + q2;
  });

  if (content !== original) {
    stats.filesTouched++;
    if (!DRY) fs.writeFileSync(htmlPath, content);
    console.log((DRY ? '[DRY] ' : '') + path.relative(ROOT, htmlPath));
  }
}

const files = walk(ROOT);
console.log(`Scanning ${files.length} HTML files...\n`);
files.forEach(processFile);

console.log('\n=== Summary ===');
console.log(`Files touched: ${stats.filesTouched}`);
console.log(`Swaps applied: ${stats.swapsApplied}`);
console.log(`Skipped (no .webp sibling or external): ${stats.skipped}`);
if (DRY) console.log('(dry run — no files written)');
