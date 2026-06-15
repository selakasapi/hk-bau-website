/**
 * Add each location's Google Business Profile URL to the matching LocalBusiness
 * sameAs array, so Google firmly links the site entity to the GBP listing.
 *
 *   Fellbach -> https://share.google/JIMqlbEzInhoSVuxj
 *   Magstadt -> https://share.google/AYyuj7XdAkcnpxR2y
 *
 * Both blocks have identical sameAs arrays, so we split each file at the
 * Magstadt name marker and insert into the correct half (first linkedin entry
 * of each half = that block's sameAs).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public');
const GBP_FELLBACH = 'https://share.google/JIMqlbEzInhoSVuxj';
const GBP_MAGSTADT = 'https://share.google/AYyuj7XdAkcnpxR2y';
const MARKER = '"name": "HK Bau GmbH – Magstadt",';
const LINKEDIN = '"https://www.linkedin.com/company/h-k-bau/",';

function walk(dir) {
  let out = [];
  for (const n of fs.readdirSync(dir)) {
    const f = path.join(dir, n); const s = fs.statSync(f);
    if (s.isDirectory()) { if (n !== 'lib' && n !== 'node_modules') out = out.concat(walk(f)); }
    else if (/\.html$/.test(n)) out.push(f);
  }
  return out;
}

let fixed = 0;
for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  const i = html.indexOf(MARKER);
  if (i === -1) continue;                       // dual-location files only
  if (html.includes(GBP_FELLBACH) || html.includes(GBP_MAGSTADT)) continue; // idempotent

  let head = html.slice(0, i);                  // contains Fellbach block
  let tail = html.slice(i);                     // contains Magstadt block

  // insert GBP link as first sameAs entry of each block (before first linkedin)
  head = head.replace(LINKEDIN, '"' + GBP_FELLBACH + '",\n        ' + LINKEDIN);
  tail = tail.replace(LINKEDIN, '"' + GBP_MAGSTADT + '",\n        ' + LINKEDIN);

  const out = head + tail;
  if (out !== html) { fs.writeFileSync(file, out); fixed++; console.log('  ' + path.relative(ROOT, file)); }
}
console.log('\nAdded GBP sameAs to ' + fixed + ' files.');
