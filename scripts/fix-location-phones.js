/**
 * One-off fix: correct the per-location telephone numbers in the dual
 * LocalBusiness JSON-LD (Fellbach + Magstadt) so they match the contact page
 * and each Google Business Profile.
 *
 * Bug: the Fellbach block carried Magstadt's number (+49 7159 4591823) and the
 * Magstadt block had no phone at all.
 *
 * Correct mapping (per kontakt.html + area codes):
 *   Fellbach (Esslinger Str. 91) -> +49 711 90652700   (0711, Stuttgart area)
 *   Magstadt (Blumenstraße 33a)  -> +49 7159 4591823   (07159, Magstadt area)
 *
 * Only touches files that contain BOTH location blocks. The einsatzgebiet pages
 * use a single generic "HK Bau GmbH" entity with the main number — left alone.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public');
const FELLBACH = '+49 711 90652700';
const MAGSTADT = '+49 7159 4591823';

function walk(dir) {
  let out = [];
  for (const n of fs.readdirSync(dir)) {
    const full = path.join(dir, n);
    const s = fs.statSync(full);
    if (s.isDirectory()) { if (n !== 'lib' && n !== 'node_modules') out = out.concat(walk(full)); }
    else if (/\.html$/.test(n)) out.push(full);
  }
  return out;
}

let fixed = 0;
for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('"name": "HK Bau GmbH – Magstadt",')) continue; // dual-block files only
  const before = html;

  // 1) Both existing telephone lines in these files are the Fellbach block's
  //    (top-level + contactPoint), wrongly set to the Magstadt number. Fix to Fellbach.
  html = html.split('"telephone": "' + MAGSTADT + '"').join('"telephone": "' + FELLBACH + '"');

  // 2) Add Magstadt top-level telephone right after its name line.
  html = html.replace(
    '"name": "HK Bau GmbH – Magstadt",',
    '"name": "HK Bau GmbH – Magstadt",\n      "telephone": "' + MAGSTADT + '",'
  );

  // 3) Add Magstadt contactPoint telephone (its contactPoint uniquely lacks one).
  html = html.replace(
    '"@type": "ContactPoint","contactType": "customer service",',
    '"@type": "ContactPoint",\n        "telephone": "' + MAGSTADT + '",\n        "contactType": "customer service",'
  );

  if (html !== before) { fs.writeFileSync(file, html); fixed++; console.log('  fixed ' + path.relative(ROOT, file)); }
}
console.log('\nUpdated ' + fixed + ' dual-location files.');
