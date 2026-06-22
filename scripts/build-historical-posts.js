/*
 * One-off: turn the 11 raw 2023–2024 upload folders into proper Aktuelles posts.
 * - creates public/images/aktuelles/<YYYY.MM.DD>-<slug>/ and moves+renames JPGs to <date>-N.jpg
 * - appends entries to public/data/aktuelles.json (array is newest-first; these are oldest -> end)
 * - adds <url> entries to public/sitemap.xml
 * WebP/thumbs/cards are generated afterwards by the npm scripts + card step.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "public");
const IMG = path.join(ROOT, "images", "aktuelles");
const JSON_PATH = path.join(ROOT, "data", "aktuelles.json");
const SITEMAP = path.join(ROOT, "sitemap.xml");

const SIG = "Wo Vision auf Fundament trifft.";

const posts = [
  {
    src: "2023.02.26_Sindelfingen",
    slug: "treppeneinbau-sindelfingen",
    date: "2023.02.26",
    iso: "2023-02-26",
    titel: "Treppeneinbau in Sindelfingen – Fertigteiltreppe im Rohbau",
    text:
      "Eine Treppe ist mehr als die Verbindung zweier Ebenen – sie muss millimetergenau sitzen.\n\n" +
      "In Sindelfingen haben wir eine Fertigteiltreppe in den Rohbau eingesetzt. Zwischen den bewehrten Stahlbetonwänden wurde das vorgefertigte Element mit dem Kran präzise eingehoben und ausgerichtet.\n\n" +
      "▪️ passgenaues Einheben der Fertigteiltreppe\n▪️ saubere Anbindung an Wände und Decken\n▪️ Stahlbeton- und Bewehrungsarbeiten im Treppenhaus\n\n" +
      "📍 Standort: Sindelfingen\n\n" + SIG,
    kurz: "In Sindelfingen haben wir eine Fertigteiltreppe millimetergenau in den Rohbau eingehoben – sauber eingebunden zwischen bewehrten Stahlbetonwänden.",
  },
  {
    src: "2023.02.27_Plattenhardt,Filderstadt",
    slug: "kellerbau-filderstadt-plattenhardt",
    date: "2023.02.27",
    iso: "2023-02-27",
    titel: "Kellerbau in Filderstadt-Plattenhardt – Stahlbeton von Grund auf",
    text:
      "Was später niemand mehr sieht, entscheidet über alles, was darüber entsteht.\n\n" +
      "In Filderstadt-Plattenhardt haben wir auf engem Grundstück das Untergeschoss in Stahlbeton erstellt – von der bewehrten Bodenplatte bis zu den geschalten Kellerwänden.\n\n" +
      "▪️ Bewehrung und Bodenplatte fachgerecht ausgeführt\n▪️ saubere Schalung der Stahlbeton-Kellerwände\n▪️ präzises Arbeiten auf beengtem Baufeld\n\n" +
      "📍 Standort: Filderstadt-Plattenhardt\n\n" + SIG,
    kurz: "Auf engem Grundstück in Filderstadt-Plattenhardt entstand das Untergeschoss in Stahlbeton – von der bewehrten Bodenplatte bis zu den geschalten Kellerwänden.",
  },
  {
    src: "2023.02.28_Sindelfingen",
    slug: "rohbau-kellergeschoss-sindelfingen",
    date: "2023.02.28",
    iso: "2023-02-28",
    titel: "Rohbau in Sindelfingen – Kellergeschoss in Stahlbeton",
    text:
      "Ein tragfähiges Untergeschoss ist die Basis für jedes Gebäude.\n\n" +
      "In Sindelfingen ist das Kellergeschoss in Stahlbeton herangewachsen. Wände, Stützen und die Schalung für die nächste Decke wurden Schritt für Schritt fachgerecht ausgeführt.\n\n" +
      "▪️ Stahlbetonwände und -stützen im Kellergeschoss\n▪️ vorbereitete Schalung und Abstützung für die Geschossdecke\n▪️ maßhaltiger Rohbau Geschoss für Geschoss\n\n" +
      "📍 Standort: Sindelfingen\n\n" + SIG,
    kurz: "In Sindelfingen wuchs das Kellergeschoss in Stahlbeton heran – Wände, Stützen und die Schalung für die nächste Decke, Schritt für Schritt fachgerecht ausgeführt.",
  },
  {
    src: "2023.03.01_Waldenbuch",
    slug: "mehrfamilienhaus-waldenbuch",
    date: "2023.03.01",
    iso: "2023-03-01",
    titel: "Mehrfamilienhaus in Waldenbuch – Neubau fertiggestellt",
    text:
      "Vom Rohbau zum fertigen Wohnhaus – in Waldenbuch ist ein modernes Mehrfamilienhaus entstanden.\n\n" +
      "Der helle, klar gegliederte Neubau steht heute fertig da. Im Umfeld liefen die abschließenden Arbeiten an den Außenanlagen.\n\n" +
      "▪️ modernes Mehrfamilienhaus, schlüsselfertig gedacht\n▪️ klare, ruhige Fassadengestaltung\n▪️ Außenanlagen und Erschließung zum Abschluss\n\n" +
      "📍 Standort: Waldenbuch\n\n" + SIG,
    kurz: "In Waldenbuch ist ein modernes Mehrfamilienhaus entstanden – heller, klar gegliederter Neubau mit abschließenden Arbeiten an den Außenanlagen.",
  },
  {
    src: "2023.03.02_Plattenhard,Filderstadt",
    slug: "dachausbau-filderstadt-plattenhardt",
    date: "2023.03.02",
    iso: "2023-03-02",
    titel: "Dachausbau in Filderstadt-Plattenhardt – neuer Wohnraum unterm Dach",
    text:
      "Unterm Dach steckt oft das größte Potenzial.\n\n" +
      "In Filderstadt-Plattenhardt haben wir das Dachgeschoss zu Wohnraum ausgebaut. Auf dem Holz-Dachstuhl liegt die Unterdeckbahn, die neuen Dachfenster stehen bereit zum Einbau.\n\n" +
      "▪️ Holz-Dachstuhl mit Unterdeckbahn\n▪️ Vorbereitung für den Einbau der Dachfenster\n▪️ neuer, lichtdurchfluteter Wohnraum im Dachgeschoss\n\n" +
      "📍 Standort: Filderstadt-Plattenhardt\n\n" + SIG,
    kurz: "In Filderstadt-Plattenhardt wurde das Dachgeschoss zu Wohnraum ausgebaut – Holz-Dachstuhl mit Unterdeckbahn, neue Dachfenster bereit zum Einbau.",
  },
  {
    src: "2023.03.08_Filderstadt_Bernshausen",
    slug: "fertigteilbau-filderstadt-bernhausen",
    date: "2023.03.08",
    iso: "2023-03-08",
    titel: "Fertigteilbau in Filderstadt-Bernhausen – Wandmontage mit dem Kran",
    text:
      "Vorgefertigt, präzise, schnell montiert.\n\n" +
      "In Filderstadt-Bernhausen wurden auf der fertigen Bodenplatte die ersten Stahlbeton-Fertigteilwände gesetzt. Der Kran hebt das Element, der Bauarbeiter richtet es millimetergenau aus.\n\n" +
      "▪️ Montage von Stahlbeton-Fertigteilwänden\n▪️ koordinierter Kraneinsatz auf dem Baufeld\n▪️ Bodenplatte mit Perimeterdämmung als Basis\n\n" +
      "📍 Standort: Filderstadt-Bernhausen\n\n" + SIG,
    kurz: "In Filderstadt-Bernhausen wurden die ersten Stahlbeton-Fertigteilwände gesetzt – per Kran eingehoben und millimetergenau auf der Bodenplatte ausgerichtet.",
  },
  {
    src: "2023.03.30_Sindelfingen",
    slug: "dachstuhl-sindelfingen",
    date: "2023.03.30",
    iso: "2023-03-30",
    titel: "Dachstuhl in Sindelfingen – Holzdachkonstruktion von oben",
    text:
      "Manche Perspektiven zeigen die ganze Arbeit auf einen Blick.\n\n" +
      "In Sindelfingen ist der neue Dachstuhl aus der Vogelperspektive zu sehen: eine präzise Holzdachkonstruktion mit eingelassenen Dachfenstern, eingerüstet und sauber ausgeführt.\n\n" +
      "▪️ Holzdachkonstruktion fachgerecht abgebunden\n▪️ Dachfenster sauber integriert\n▪️ eingerüsteter, ordentlich organisierter Bauablauf\n\n" +
      "📍 Standort: Sindelfingen\n\n" + SIG,
    kurz: "Aus der Vogelperspektive in Sindelfingen: eine präzise Holzdachkonstruktion mit eingelassenen Dachfenstern, eingerüstet und sauber ausgeführt.",
  },
  {
    src: "2023.05.27_Neckartailfingen",
    slug: "baubeginn-neckartailfingen",
    date: "2023.05.27",
    iso: "2023-05-27",
    titel: "Baubeginn in Neckartailfingen – Erdarbeiten und Gründung",
    text:
      "Jedes große Projekt beginnt im Boden.\n\n" +
      "In Neckartailfingen ist der Startschuss für ein neues Bauvorhaben gefallen. Bagger und Kran sind im Einsatz, die Gründung wird vorbereitet – der Beginn eines Projekts, das wir über viele Monate begleiten.\n\n" +
      "▪️ Erdarbeiten und Aushub\n▪️ Vorbereitung der Gründung\n▪️ Turmkran aufgestellt, Logistik eingerichtet\n\n" +
      "📍 Standort: Neckartailfingen\n\n" + SIG,
    kurz: "In Neckartailfingen ist der Startschuss gefallen: Erdarbeiten, Aushub und die Vorbereitung der Gründung – der Beginn eines Projekts über viele Monate.",
  },
  {
    src: "2023.07.19_Neckartailfingen",
    slug: "rohbau-neckartailfingen",
    date: "2023.07.19",
    iso: "2023-07-19",
    titel: "Rohbau in Neckartailfingen – Kellergeschoss nimmt Form an",
    text:
      "Aus der Baugrube wächst Schritt für Schritt ein Gebäude.\n\n" +
      "In Neckartailfingen nimmt das Kellergeschoss Form an: Die Stahlbetonwände gliedern die ersten Räume, die nächsten Bauabschnitte sind vorbereitet.\n\n" +
      "▪️ Stahlbetonwände im Kellergeschoss\n▪️ erste Raumaufteilung sichtbar\n▪️ vorbereitete Schalung für die weiteren Geschosse\n\n" +
      "📍 Standort: Neckartailfingen\n\n" + SIG,
    kurz: "In Neckartailfingen nimmt das Kellergeschoss Form an – Stahlbetonwände gliedern die ersten Räume, die nächsten Bauabschnitte sind vorbereitet.",
  },
  {
    src: "2023.09.17_Neckartailfingen",
    slug: "deckenbau-neckartailfingen",
    date: "2023.09.17",
    iso: "2023-09-17",
    titel: "Neckartailfingen – Anlieferung der Deckenelemente",
    text:
      "Gute Logistik ist auf der Baustelle die halbe Miete.\n\n" +
      "In Neckartailfingen wurden die Deckenelemente angeliefert. Zwei Turmkräne stehen bereit, um die Filigranplatten passgenau auf die Wände zu setzen – ein wichtiger Schritt zum nächsten Geschoss.\n\n" +
      "▪️ Anlieferung der Filigran-Deckenelemente\n▪️ koordinierter Einsatz von zwei Turmkränen\n▪️ vorbereiteter Einbau der Geschossdecke\n\n" +
      "📍 Standort: Neckartailfingen\n\n" + SIG,
    kurz: "In Neckartailfingen wurden die Filigran-Deckenelemente angeliefert – zwei Turmkräne bereit, um die Platten passgenau zu setzen. Ein Schritt zum nächsten Geschoss.",
  },
  {
    src: "2024.02.01-Neckartailfingen",
    slug: "geschossdecke-neckartailfingen",
    date: "2024.02.01",
    iso: "2024-02-01",
    titel: "Neckartailfingen – Geschossdecke bereit zur Betonage",
    text:
      "Hier wird sichtbar, wie weit das Projekt gewachsen ist.\n\n" +
      "In Neckartailfingen ist die Geschossdecke bewehrt und bereit zur Betonage. Auf den verlegten Filigranplatten liegt die Bewehrung, zwei Turmkräne versorgen die Baustelle – das Gebäude hat die oberen Geschosse erreicht.\n\n" +
      "▪️ verlegte Filigranplatten mit Bewehrung\n▪️ Geschossdecke vorbereitet zur Betonage\n▪️ Projektfortschritt bis in die Obergeschosse\n\n" +
      "📍 Standort: Neckartailfingen\n\n" + SIG,
    kurz: "In Neckartailfingen ist die Geschossdecke bewehrt und bereit zur Betonage – verlegte Filigranplatten, Bewehrung und zwei Turmkräne im Einsatz.",
  },
];

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

const newEntries = [];
const sitemapUrls = [];

for (const p of posts) {
  const srcDir = path.join(IMG, p.src);
  if (!fs.existsSync(srcDir)) {
    console.error("MISSING source folder:", p.src);
    process.exit(1);
  }
  const destName = `${p.date}-${p.slug}`;
  const destDir = path.join(IMG, destName);
  fs.mkdirSync(destDir, { recursive: true });

  const files = fs
    .readdirSync(srcDir)
    .filter((f) => /\.jpe?g$/i.test(f))
    .sort(naturalSort);

  const bilder = [];
  files.forEach((f, i) => {
    const newName = `${p.date}-${i + 1}.jpg`;
    fs.renameSync(path.join(srcDir, f), path.join(destDir, newName));
    bilder.push(`images/aktuelles/${destName}/${p.date}-${i + 1}.webp`);
  });

  // remove now-empty source folder
  const leftover = fs.readdirSync(srcDir);
  if (leftover.length === 0) fs.rmdirSync(srcDir);

  newEntries.push({
    id: p.slug,
    datum: p.iso,
    titel: p.titel,
    text: p.text,
    kurz: p.kurz,
    bild: bilder[0],
    bilder: bilder,
    thumb: `images/aktuelles/${destName}/card.webp`,
  });

  sitemapUrls.push({ slug: p.slug, date: p.iso });
  console.log(`prepared ${destName} (${files.length} images)`);
}

// --- aktuelles.json: append (these are all older than the current oldest) ---
const data = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
data.push(...newEntries);
// keep newest-first ordering by date desc (stable)
data.sort((a, b) => (a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : 0));
fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2) + "\n");
console.log(`aktuelles.json now has ${data.length} entries`);

// --- sitemap.xml: insert before closing </urlset> ---
let sm = fs.readFileSync(SITEMAP, "utf8");
const block = sitemapUrls
  .map(
    (u) =>
      `  <url>\n    <loc>https://www.hk-bau.com/aktuelles/${u.slug}.html</loc>\n    <lastmod>${u.date}</lastmod>\n    <changefreq>yearly</changefreq>\n    <priority>0.6</priority>\n  </url>`
  )
  .join("\n");
sm = sm.replace("</urlset>", block + "\n</urlset>");
fs.writeFileSync(SITEMAP, sm);
console.log(`sitemap.xml: added ${sitemapUrls.length} urls`);
