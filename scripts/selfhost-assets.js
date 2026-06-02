/**
 * One-off migration: repoint Font Awesome, AOS, and CookieConsent from their
 * CDNs (cdnjs / unpkg / jsdelivr) to self-hosted copies under public/lib/.
 *
 * DSGVO motivation: third-party CDNs receive the visitor's IP address on every
 * page load, before any consent. Self-hosting eliminates those calls (LG
 * München 3 O 17493/20). After this runs, the only third-party that loads is
 * Google Analytics/GTM — and that's already gated behind cookie consent.
 *
 * Also strips now-useless preconnect hints to those three CDNs.
 *
 * Run once: node scripts/selfhost-assets.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public');

function walk(dir) {
  let out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const s = fs.statSync(full);
    if (s.isDirectory()) {
      if (name === 'lib' || name === 'node_modules') continue;
      out = out.concat(walk(full));
    } else if (/\.html$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

const files = walk(ROOT);
let touched = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const depth = rel.split(path.sep).length - 1;   // 0 for top-level pages
  const p = '../'.repeat(depth);                   // path prefix to public/
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  // Font Awesome CSS (cdnjs) -> local
  html = html.replace(
    /<link\b[^>]*cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome[^>]*>/gi,
    `<link rel="stylesheet" href="${p}lib/fontawesome/css/all.min.css" media="print" onload="this.media='all'" />`
  );

  // AOS CSS (unpkg) -> local
  html = html.replace(
    /<link\b[^>]*unpkg\.com\/aos@[^>]*>/gi,
    `<link rel="stylesheet" href="${p}lib/aos/aos.css" media="print" onload="this.media='all'" />`
  );
  // AOS JS (unpkg) -> local
  html = html.replace(
    /<script\b[^>]*unpkg\.com\/aos@[^>]*><\/script>/gi,
    `<script src="${p}lib/aos/aos.js" defer></script>`
  );

  // CookieConsent CSS (jsdelivr) -> local
  html = html.replace(
    /<link\b[^>]*cdn\.jsdelivr\.net\/npm\/cookieconsent@3[^>]*>/gi,
    `<link rel="stylesheet" href="${p}lib/cookieconsent/cookieconsent.min.css" media="print" onload="this.media='all'" />`
  );
  // CookieConsent JS (jsdelivr) -> local
  html = html.replace(
    /<script\b[^>]*cdn\.jsdelivr\.net\/npm\/cookieconsent@3[^>]*><\/script>/gi,
    `<script src="${p}lib/cookieconsent/cookieconsent.min.js" defer></script>`
  );

  // Strip now-useless preconnect hints to the three CDNs (keep googletagmanager)
  html = html.replace(
    /[ \t]*<link\b[^>]*rel=["']preconnect["'][^>]*(?:cdnjs\.cloudflare\.com|unpkg\.com|cdn\.jsdelivr\.net)[^>]*>\s*\n?/gi,
    ''
  );

  if (html !== before) {
    fs.writeFileSync(file, html);
    touched++;
  }
}

console.log(`Repointed assets to self-hosted /lib in ${touched} HTML files.`);
console.log('Remaining external loaders should be Google (GTM/GA) only — gated by consent.');
