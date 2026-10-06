/*
 * Shrinks Font Awesome to the icons this site actually uses.
 *
 * Reads the untouched originals from scripts/vendor/fontawesome/ and writes
 * a trimmed all.min.css + subsetted woff2 files to public/lib/fontawesome/.
 * Markup stays exactly the same (<i class="fas fa-phone">), so nothing else
 * needs to change.
 *
 * Run `npm run build:icons` after adding an icon that was not used before.
 * `npm run build:icons -- --list` only prints what it found.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(__dirname, 'vendor', 'fontawesome');
const OUT = path.join(ROOT, 'public', 'lib', 'fontawesome');
const FONTS = ['fa-solid-900.woff2', 'fa-regular-400.woff2', 'fa-brands-400.woff2'];
const LIST_ONLY = process.argv.includes('--list');

const slash = (p) => p.split(path.sep).join('/');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (slash(p).includes('lib/fontawesome')) continue;
    if (e.isDirectory()) walk(p, out);
    else if (/\.(html|js|css|json)$/.test(e.name)) out.push(p);
  }
  return out;
}

// every place an icon class can come from: pages, runtime JS, page generators
const sources = walk(path.join(ROOT, 'public'));
for (const s of fs.readdirSync(__dirname)) {
  if (s.endsWith('.js') && s !== path.basename(__filename)) sources.push(path.join(__dirname, s));
}

const fullCss = fs.readFileSync(path.join(SRC, 'css', 'all.min.css'), 'utf8');

// icon name -> codepoint, from rules like .fa-phone:before,.fa-x:before{content:"\f095"}
const codeOf = {};
const ICON_RULE = /((?:\.fa-[a-z0-9-]+:{1,2}before,?)+)\{content:"\\([0-9a-f]+)"\}/g;
for (const m of fullCss.matchAll(ICON_RULE)) {
  for (const n of m[1].matchAll(/\.fa-([a-z0-9-]+):/g)) codeOf[n[1]] = m[2];
}

const used = new Set();
const rawCodes = new Set();
for (const f of sources) {
  const c = fs.readFileSync(f, 'utf8');
  for (const m of c.matchAll(/\bfa-([a-z0-9]+(?:-[a-z0-9]+)*)\b/g)) {
    if (codeOf[m[1]]) used.add(m[1]);
  }
  // icons referenced directly by codepoint in CSS, e.g. content:"\f095"
  for (const m of c.matchAll(/content:\s*["']\\([ef][0-9a-f]{3})\b/gi)) rawCodes.add(m[1].toLowerCase());
}

const codes = new Set([...rawCodes, ...[...used].map((n) => codeOf[n])]);
console.log(`Icons in Font Awesome: ${Object.keys(codeOf).length} | used on this site: ${used.size}`);
console.log([...used].sort().join(' '));
if (rawCodes.size) console.log('Referenced by codepoint:', [...rawCodes].join(' '));
if (LIST_ONLY) process.exit(0);

// ---- CSS: drop icon rules for unused icons, keep everything else ----
let css = fullCss.replace(ICON_RULE, (rule, selectors, code) => {
  const keep = selectors
    .split(',')
    .filter(Boolean)
    .filter((sel) => used.has(sel.replace(/^\.fa-/, '').replace(/:{1,2}before$/, '')));
  return keep.length ? `${keep.join(',')}{content:"\\${code}"}` : '';
});
// legacy Font Awesome 4 font files were never shipped here; drop their @font-face
css = css.replace(/@font-face\{[^}]*fa-v4compatibility[^}]*\}/g, '');
// only woff2 is shipped
css = css.replace(/,url\(\.\.\/webfonts\/[a-z0-9-]+\.ttf\) format\("truetype"\)/g, '');

(async () => {
  const subsetFont = require('subset-font');
  const text = [...codes].map((c) => String.fromCodePoint(parseInt(c, 16))).join('');

  fs.mkdirSync(path.join(OUT, 'css'), { recursive: true });
  fs.mkdirSync(path.join(OUT, 'webfonts'), { recursive: true });

  let before = Buffer.byteLength(fullCss);
  let after = Buffer.byteLength(css);
  fs.writeFileSync(path.join(OUT, 'css', 'all.min.css'), css);
  console.log(`all.min.css  ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);

  for (const name of FONTS) {
    const full = fs.readFileSync(path.join(SRC, 'webfonts', name));
    const small = await subsetFont(full, text, { targetFormat: 'woff2' });
    fs.writeFileSync(path.join(OUT, 'webfonts', name), small);
    console.log(`${name}  ${(full.length / 1024).toFixed(0)} KB -> ${(small.length / 1024).toFixed(1)} KB`);
    before += full.length;
    after += small.length;
  }
  console.log(`Total ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
})();
