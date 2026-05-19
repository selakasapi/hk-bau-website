/**
 * One-off audit of public/sitemap.xml — checks for duplicates, http vs https,
 * non-www, stale/future lastmod, missing-on-disk URLs, leftover /Referenzen/
 * URLs, and HTML files on disk that aren't in the sitemap.
 */
const fs = require('fs');
const path = require('path');

const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const dates = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1]);

console.log('=== SITEMAP HEALTH ===');
console.log('Total URLs:', urls.length);
console.log('Total lastmod:', dates.length);

const dupes = urls.filter((u, i) => urls.indexOf(u) !== i);
console.log('Duplicates:', dupes.length, dupes.length ? '— ' + dupes.join(', ') : '');

const nonHttps = urls.filter(u => !u.startsWith('https://'));
console.log('Non-https URLs:', nonHttps.length, nonHttps.length ? '— ' + nonHttps.join(', ') : '');

const nonWww = urls.filter(u => !u.startsWith('https://www.hk-bau.com'));
console.log('Non-www URLs:', nonWww.length, nonWww.length ? '— ' + nonWww.join(', ') : '');

const today = '2026-05-18';
const stale = dates.filter(d => d < '2026-05-01');
const future = dates.filter(d => d > today);
console.log('Pre-May dates (>17 days old):', stale.length, stale.length ? '— ' + [...new Set(stale)].join(', ') : '');
console.log('Future dates:', future.length, future.length ? '— ' + future.join(', ') : '');

const missing = [];
const oldRef = [];
for (const url of urls) {
  let rel = url.replace('https://www.hk-bau.com/', '');
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  rel = rel.split('?')[0];
  const localPath = path.join('public', rel);
  if (!fs.existsSync(localPath)) missing.push(url);
  if (url.includes('/Referenzen/')) oldRef.push(url);
}
console.log('URLs with no corresponding file on disk:', missing.length);
missing.forEach(u => console.log('  MISSING:', u));
console.log('Old /Referenzen/ URLs (should be /referenzen-galerie/):', oldRef.length);
oldRef.forEach(u => console.log('  OLD:', u));

function walk(dir) {
  let out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const s = fs.statSync(full);
    if (s.isDirectory() && name !== 'node_modules' && name !== '.git') {
      out = out.concat(walk(full));
    } else if (s.isFile() && /\.html$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}
const htmlFiles = walk('public');
const inSitemap = new Set(
  urls.map(u => u.replace('https://www.hk-bau.com/', 'public/').split('?')[0])
      .map(p => p === 'public/' ? 'public/index.html' : p)
);
const norm = f => f.split(path.sep).join('/');
const exclude = /(?:404\.html|impressum\.html|datenschutzerklaerung\.html|aktuelles\/post\.html|robots\.txt)/;
const missingFromSitemap = htmlFiles
  .map(norm)
  .filter(f => !inSitemap.has(f))
  .filter(f => !exclude.test(f));
console.log('HTML files NOT in sitemap (excluding 404/legal/post-template):', missingFromSitemap.length);
missingFromSitemap.slice(0, 30).forEach(f => console.log('  not-in-sitemap:', f));
