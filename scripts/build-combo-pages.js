/*
 * Generates service+city combo landing pages (e.g. rohbau-fellbach.html) from the
 * seo-* service template. Two axes of variation (4 services x 7 core cities = 28 pages):
 * service-specific copy + city-specific region context -> defensible, non-thin.
 */
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..", "public", "einsatzgebiet");

const SERVICES = {
  rohbau: {
    label: "Rohbau",
    cardDesc: "Tragende Strukturen, Stahlbeton und Mauerwerk für robuste Baukörper.",
    img: "stahlbetonbau.webp",
    heroAlt: (c) => `Rohbau und Stahlbetonbau ${c}`,
    h1: (c) => `Rohbau in ${c} klar geplant und sauber ausgeführt.`,
    heroP: (c) =>
      `HK Bau übernimmt Rohbauarbeiten in ${c} und Umgebung: von tragenden Strukturen über Stahlbetonbau bis Mauerwerksbau. Sauber organisiert, direkt erreichbar und mit Erfahrung aus realen Projekten.`,
    focus: "Rohbau, Stahlbeton, Mauerwerk",
    splitH2: (c) => `Rohbau für Projekte in ${c}, die sauber organisiert sein müssen.`,
    splitP1: (c) =>
      `Rohbau ist der Teil eines Bauprojekts, bei dem Fehler später teuer werden. Deshalb zählen in ${c} klare Abläufe, genaue Abstimmung und eine Ausführung, die auch unter Baustellenrealität stabil bleibt.`,
    splitP2: (c, r) =>
      `Zum Leistungsbereich gehören Stahlbetonbau, Mauerwerksbau, Fundamente, tragende Bauteile und koordinierte Rohbauphasen. Von den Standorten Fellbach und Magstadt aus betreuen wir Projekte in ${c}, ${r} und der weiteren Region.`,
    serviceType: ["Rohbau", "Stahlbetonbau", "Mauerwerksbau", "Hochbau"],
    faq: (c) => [
      [`Übernimmt HK Bau Rohbauarbeiten in ${c}?`, `Ja. HK Bau führt Rohbau-, Stahlbeton- und Mauerwerksarbeiten in ${c} und Umgebung aus – je nach Umfang, Bauphase und Terminplanung.`],
      [`Bietet HK Bau alle Bauleistungen aus einer Hand?`, `Ja. HK Bau übernimmt das komplette Bauspektrum – Rohbau, Hochbau, Tiefbau, Stahlbetonbau, Mauerwerksbau und schlüsselfertiges Bauen. Besonders im Hochbau und Rohbau begleiten wir Projekte von der Gründung bis zum fertigen Bauwerk – alles aus einer Hand.`],
      [`Wie frage ich ein Rohbauprojekt an?`, `Senden Sie uns Standort, Leistungsumfang und groben Zeitrahmen. Danach prüfen wir, ob Umfang und Termin zu unseren Kapazitäten passen.`],
    ],
  },
  tiefbau: {
    label: "Tiefbau",
    cardDesc: "Erdarbeiten, Baugruben und Kanalbau für tragfähige Baugrundlagen.",
    img: "erdbau.webp",
    heroAlt: (c) => `Tiefbau und Erdbau ${c}`,
    h1: (c) => `Tiefbau in ${c} – von der Baugrube bis zur Infrastruktur.`,
    heroP: (c) =>
      `HK Bau übernimmt Tiefbau- und Erdarbeiten in ${c} und Umgebung: Aushub, Baugruben, Kanalbau und die Vorbereitung tragfähiger Baugrundlagen.`,
    focus: "Tiefbau, Erdbau, Kanalbau",
    splitH2: (c) => `Tiefbau als saubere Grundlage für jedes Bauvorhaben in ${c}.`,
    splitP1: (c) =>
      `Im Tiefbau entscheidet sich, wie tragfähig und verlässlich der Baugrund ist. In ${c} kommt es auf genaue Vorbereitung, sichere Baugruben und saubere Leitungsführung an.`,
    splitP2: (c, r) =>
      `Zum Leistungsbereich gehören Erdarbeiten, Aushub, Baugruben, Kanal- und Leitungsbau sowie die Vorbereitung der Infrastruktur. Von den Standorten Fellbach und Magstadt aus betreuen wir Projekte in ${c}, ${r} und der weiteren Region.`,
    serviceType: ["Tiefbau", "Erdbau", "Kanalbau"],
    faq: (c) => [
      [`Macht HK Bau Tiefbau in ${c}?`, `Ja. HK Bau übernimmt Erdarbeiten, Baugruben und Kanalbau in ${c} und Umgebung – abhängig von Umfang, Bauphase und Termin.`],
      [`Bietet HK Bau alle Bauleistungen aus einer Hand?`, `Ja. HK Bau übernimmt das komplette Bauspektrum – Rohbau, Hochbau, Tiefbau, Stahlbetonbau, Mauerwerksbau und schlüsselfertiges Bauen. Besonders im Hochbau und Rohbau begleiten wir Projekte von der Gründung bis zum fertigen Bauwerk – alles aus einer Hand.`],
      [`Wie frage ich ein Tiefbauprojekt an?`, `Senden Sie uns Standort, Leistungsumfang und groben Zeitrahmen. Danach prüfen wir, ob Umfang und Termin zu unseren Kapazitäten passen.`],
    ],
  },
  hochbau: {
    label: "Hochbau",
    cardDesc: "Mauerwerk, Geschossbau und koordinierte Bauphasen über dem Fundament.",
    img: "mauerwerksbau.webp",
    heroAlt: (c) => `Hochbau ${c} Baustelle`,
    h1: (c) => `Hochbau in ${c} – Geschoss für Geschoss verlässlich umgesetzt.`,
    heroP: (c) =>
      `HK Bau übernimmt Hochbauarbeiten in ${c} und Umgebung: Mauerwerksbau, Geschossbau und koordinierte Bauphasen über dem Fundament.`,
    focus: "Hochbau, Mauerwerk, Koordination",
    splitH2: (c) => `Hochbau in ${c} mit klarer Koordination und sauberer Ausführung.`,
    splitP1: (c) =>
      `Im Hochbau wächst das Gebäude sichtbar in die Höhe. In ${c} zählen dabei Maßhaltigkeit, abgestimmte Gewerke und ein verlässlicher Bauablauf.`,
    splitP2: (c, r) =>
      `Zum Leistungsbereich gehören Mauerwerksbau, Stahlbeton im Aufgehenden, Geschossdecken und koordinierte Hochbauphasen. Von den Standorten Fellbach und Magstadt aus betreuen wir Projekte in ${c}, ${r} und der weiteren Region.`,
    serviceType: ["Hochbau", "Mauerwerksbau", "Stahlbetonbau"],
    faq: (c) => [
      [`Übernimmt HK Bau Hochbau in ${c}?`, `Ja. HK Bau führt Hochbau- und Mauerwerksarbeiten in ${c} und Umgebung aus – je nach Umfang, Bauphase und Terminplanung.`],
      [`Bietet HK Bau alle Bauleistungen aus einer Hand?`, `Ja. HK Bau übernimmt das komplette Bauspektrum – Rohbau, Hochbau, Tiefbau, Stahlbetonbau, Mauerwerksbau und schlüsselfertiges Bauen. Besonders im Hochbau und Rohbau begleiten wir Projekte von der Gründung bis zum fertigen Bauwerk – alles aus einer Hand.`],
      [`Wie frage ich ein Hochbauprojekt an?`, `Senden Sie uns Standort, Leistungsumfang und groben Zeitrahmen. Danach prüfen wir, ob Umfang und Termin zu unseren Kapazitäten passen.`],
    ],
  },
  schluesselfertigbau: {
    label: "Schlüsselfertigbau",
    cardDesc: "Koordinierte Abläufe und klare Schnittstellen bis zur Übergabe.",
    img: "pexels-sevenstormphotography-439416.webp",
    heroAlt: (c) => `Schlüsselfertigbau ${c}`,
    h1: (c) => `Schlüsselfertigbau in ${c} – ein Ansprechpartner bis zur Übergabe.`,
    heroP: (c) =>
      `HK Bau koordiniert schlüsselfertige Bauleistungen in ${c} und Umgebung: klare Schnittstellen, abgestimmte Gewerke und verlässliche Umsetzung.`,
    focus: "Schlüsselfertig, Koordination",
    splitH2: (c) => `Schlüsselfertig bauen in ${c} heißt: weniger Schnittstellen für Sie.`,
    splitP1: (c) =>
      `Schlüsselfertigbau bündelt viele Gewerke in einer Hand. In ${c} bedeutet das für Bauherren weniger Abstimmungsaufwand und klare Verantwortlichkeit.`,
    splitP2: (c, r) =>
      `Von der Koordination über die Ausführung bis zur Übergabe behalten wir Termine, Schnittstellen und Qualität im Blick. Von den Standorten Fellbach und Magstadt aus betreuen wir Projekte in ${c}, ${r} und der weiteren Region.`,
    serviceType: ["Schlüsselfertigbau", "Hochbau", "Rohbau"],
    faq: (c) => [
      [`Bietet HK Bau Schlüsselfertigbau in ${c}?`, `Ja. HK Bau koordiniert schlüsselfertige Bauleistungen in ${c} und Umgebung – von der Planung der Abläufe bis zur Übergabe.`],
      [`Was umfasst Schlüsselfertigbau?`, `Die Koordination der Gewerke, klare Schnittstellen, Termin- und Qualitätskontrolle sowie die Ausführung bis zur Übergabe.`],
      [`Wie frage ich ein Projekt an?`, `Senden Sie uns Standort, Leistungsumfang und groben Zeitrahmen. Danach prüfen wir, ob Umfang und Termin zu unseren Kapazitäten passen.`],
    ],
  },
};

const CITIES = {
  fellbach: { name: "Fellbach", regionShort: "dem Rems-Murr-Kreis", region: ["Stuttgart", "Waiblingen", "Kernen im Remstal", "Weinstadt", "Esslingen", "Ludwigsburg"], neighbors: [["bauunternehmen-stuttgart.html", "Stuttgart"], ["bauunternehmen-waiblingen.html", "Waiblingen"], ["bauunternehmen-weinstadt.html", "Weinstadt"], ["bauunternehmen-esslingen.html", "Esslingen"], ["bauunternehmen-schorndorf.html", "Schorndorf"]] },
  magstadt: { name: "Magstadt", regionShort: "dem Landkreis Böblingen", region: ["Sindelfingen", "Böblingen", "Renningen", "Weil der Stadt", "Leonberg", "Aidlingen"], neighbors: [["bauunternehmen-sindelfingen.html", "Sindelfingen"], ["bauunternehmen-boeblingen.html", "Böblingen"], ["bauunternehmen-renningen.html", "Renningen"], ["bauunternehmen-weil-der-stadt.html", "Weil der Stadt"], ["bauunternehmen-leonberg.html", "Leonberg"]] },
  sindelfingen: { name: "Sindelfingen", regionShort: "dem Landkreis Böblingen", region: ["Böblingen", "Magstadt", "Leonberg", "Renningen", "Stuttgart", "Ehningen"], neighbors: [["bauunternehmen-boeblingen.html", "Böblingen"], ["bauunternehmen-magstadt.html", "Magstadt"], ["bauunternehmen-leonberg.html", "Leonberg"], ["bauunternehmen-renningen.html", "Renningen"], ["bauunternehmen-stuttgart.html", "Stuttgart"]] },
  boeblingen: { name: "Böblingen", regionShort: "dem Landkreis Böblingen", region: ["Sindelfingen", "Magstadt", "Leonberg", "Herrenberg", "Holzgerlingen", "Stuttgart"], neighbors: [["bauunternehmen-sindelfingen.html", "Sindelfingen"], ["bauunternehmen-magstadt.html", "Magstadt"], ["bauunternehmen-leonberg.html", "Leonberg"], ["bauunternehmen-herrenberg.html", "Herrenberg"], ["bauunternehmen-stuttgart.html", "Stuttgart"]] },
  ludwigsburg: { name: "Ludwigsburg", regionShort: "dem Landkreis Ludwigsburg", region: ["Kornwestheim", "Asperg", "Tamm", "Remseck am Neckar", "Marbach am Neckar", "Bietigheim-Bissingen"], neighbors: [["bauunternehmen-kornwestheim.html", "Kornwestheim"], ["bauunternehmen-asperg.html", "Asperg"], ["bauunternehmen-tamm.html", "Tamm"], ["bauunternehmen-remseck-am-neckar.html", "Remseck am Neckar"], ["bauunternehmen-marbach-am-neckar.html", "Marbach am Neckar"]] },
  waiblingen: { name: "Waiblingen", regionShort: "dem Rems-Murr-Kreis", region: ["Fellbach", "Winnenden", "Weinstadt", "Schorndorf", "Backnang", "Stuttgart"], neighbors: [["bauunternehmen-fellbach.html", "Fellbach"], ["bauunternehmen-winnenden.html", "Winnenden"], ["bauunternehmen-weinstadt.html", "Weinstadt"], ["bauunternehmen-schorndorf.html", "Schorndorf"], ["bauunternehmen-backnang.html", "Backnang"]] },
  esslingen: { name: "Esslingen am Neckar", regionShort: "dem Landkreis Esslingen", region: ["Ostfildern", "Plochingen", "Wendlingen am Neckar", "Denkendorf", "Köngen", "Stuttgart"], neighbors: [["bauunternehmen-ostfildern.html", "Ostfildern"], ["bauunternehmen-plochingen.html", "Plochingen"], ["bauunternehmen-wendlingen-am-neckar.html", "Wendlingen am Neckar"], ["bauunternehmen-denkendorf.html", "Denkendorf"], ["bauunternehmen-koengen.html", "Köngen"]] },
};

function page(svcKey, cityKey) {
  const s = SERVICES[svcKey];
  const c = CITIES[cityKey];
  const city = c.name;
  const slug = `${svcKey}-${cityKey}`;
  const url = `https://www.hk-bau.com/einsatzgebiet/${slug}.html`;
  const title = `${s.label} ${city} | HK Bau GmbH`;
  const areaServed = JSON.stringify([city, ...c.region]);
  const faq = s.faq(city);
  const serviceJson = `{"@context":"https://schema.org","@type":"Service","name":"${s.label} ${city}","serviceType":${JSON.stringify(s.serviceType)},"areaServed":${areaServed},"provider":{"@type":"LocalBusiness","name":"HK Bau GmbH","legalName":"H+K Bauunternehmung GmbH","url":"https://www.hk-bau.com","telephone":"+49 7159 4591823","email":"info@hk-bau.net","image":"https://www.hk-bau.com/images/og-preview.jpg","logo":"https://www.hk-bau.com/images/icon/logo.png","address":{"@type":"PostalAddress","streetAddress":"Esslinger Str. 91","postalCode":"70734","addressLocality":"Fellbach","addressCountry":"DE"}}}`;
  const breadcrumbJson = `{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Startseite","item":"https://www.hk-bau.com/"},{"@type":"ListItem","position":2,"name":"Einsatzgebiet","item":"https://www.hk-bau.com/einsatzgebiet/bauunternehmen-region-stuttgart.html"},{"@type":"ListItem","position":3,"name":"${s.label} ${city}"}]}`;
  const faqJson = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f[0], acceptedAnswer: { "@type": "Answer", text: f[1] } })) });

  // service grid links to this city's OTHER service combos -> tight per-city cluster
  const otherSvcCards = Object.keys(SERVICES)
    .filter((k) => k !== svcKey)
    .map((k, i) => {
      const o = SERVICES[k];
      return `<a href="${k}-${cityKey}.html"${i ? ` data-aos-delay="${i * 100}"` : ""} data-aos="fade-up"><img src="../images/${o.img}" alt="${o.label} ${city}" width="900" height="650" loading="lazy" /><span>0${i + 1}</span><h3>${o.label} ${city}</h3><p>${o.cardDesc}</p></a>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#fbbb21" />
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="preload" href="../css/style.css?v=10" as="style" />
<link rel="preload" href="../fonts/Poppins-Regular.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="../images/icon/logo.png" as="image" />
<link rel="preload" href="../images/${s.img}" as="image" fetchpriority="high" />
<title>${title}</title>
<meta name="description" content="${s.label} in ${city} und Umgebung: HK Bau übernimmt ${s.focus.toLowerCase()} und koordinierte Bauleistungen – sauber geplant und zuverlässig ausgeführt." />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:site_name" content="HK Bau GmbH" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${s.label} für ${city} und Umgebung – HK Bau, Bauunternehmen aus der Region Stuttgart." />
<meta property="og:image" content="https://www.hk-bau.com/images/og-preview.jpg" />
<meta property="og:locale" content="de_DE" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${s.label} für ${city} und Umgebung – HK Bau, Bauunternehmen aus der Region Stuttgart." />
<meta name="twitter:image" content="https://www.hk-bau.com/images/og-preview.jpg" />
<script type="application/ld+json">${serviceJson}</script>
<link rel="icon" type="image/png" href="../favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="../favicon.svg" />
<link rel="shortcut icon" href="../favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="../apple-touch-icon.png" />
<link rel="manifest" href="../site.webmanifest" />
<link rel="stylesheet" href="../lib/fontawesome/css/all.min.css" media="print" onload="this.media='all'" />
<link rel="stylesheet" href="../css/tailwind.min.css" />
<link rel="stylesheet" href="../lib/aos/aos.css" media="print" onload="this.media='all'" />
<link rel="stylesheet" href="../css/style.css?v=10" />
<script src="../lib/cookieconsent/cookieconsent.min.js" defer></script>
<link rel="stylesheet" href="../lib/cookieconsent/cookieconsent.min.css" media="print" onload="this.media='all'" />
<script src="../js/analytics-consent.js?v=2" defer></script>
<script type="application/ld+json">${breadcrumbJson}</script>
<script type="application/ld+json">${faqJson}</script>
</head>
<body class="page-seo-preview font-[Poppins] overflow-x-hidden">
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[var(--primary-color)] focus:text-white focus:px-4 focus:py-2 focus:rounded">Zum Hauptinhalt springen</a>
<script src="../js/init-transition.js"></script><script src="../lib/aos/aos.js" defer></script><script src="../js/app.js" defer></script>
<div id="pageTransitionOverlay" class="page-transition-overlay flex items-center justify-center"><div class="flex flex-col items-center space-y-4"><div class="h-20 w-20 rounded-full bg-white border-4 border-[var(--primary-color)] flex items-center justify-center shadow-lg"><img height="128" width="128" src="../images/icon/logo.png" alt="HK Bau Logo" class="h-12 w-12 animate-spin-slower" /></div></div></div>
<header class="fixed top-0 left-0 w-full z-30 transition duration-300" id="navbar"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16"><div class="logo-container"><a href="../index.html" class="flex items-center relative z-20"><img src="../images/icon/logo.png" alt="HK Bau Logo" class="h-16 w-auto rounded-full shadow logo" width="64" height="64" /><span class="text-white font-bold ml-2">HK Bau</span></a></div><nav aria-label="Hauptnavigation" class="hidden md:flex space-x-8 font-medium"><a href="../index.html">Startseite</a><a href="../leistungen.html">Leistungen</a><a href="../referenzen.html">Referenzen</a><a href="../aktuelles.html">Aktuelles</a><a href="../karriere.html">Karriere</a><a href="../kontakt.html">Kontakt</a></nav><button id="mobile-menu-button" class="md:hidden z-[100] p-2 focus:outline-none" aria-label="Menü öffnen" aria-expanded="false"><svg class="h-6 w-6 fill-current text-white" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" /></svg></button></div><div id="nav-backdrop" class="fixed inset-0 bg-black/70 z-[98] hidden transition-opacity duration-300"></div><div id="mobile-menu" class="hidden fixed top-0 left-0 w-full bg-[var(--secondary-color)] text-white z-[99] p-6"><a href="../index.html">Startseite</a><a href="../leistungen.html">Leistungen</a><a href="../referenzen.html">Referenzen</a><a href="../aktuelles.html" class="block py-2 px-3 text-base font-medium hover:text-[var(--primary-color)]">Aktuelles</a><a href="../karriere.html">Karriere</a><a href="../kontakt.html">Kontakt</a></div></header>
<main id="main-content">
  <section class="seo-hero"><img src="../images/${s.img}" alt="${s.heroAlt(city)}" width="1920" height="1080" data-hero-media /><div class="seo-hero__overlay"></div><div class="seo-hero__content" data-aos="fade-up"><span>${s.label} ${city}</span><h1>${s.h1(city)}</h1><p>${s.heroP(city)}</p><div class="seo-hero__actions"><a href="../kontakt.html">Projekt anfragen</a><a href="../referenzen.html">Referenzen ansehen</a></div></div></section>
  <section class="seo-proof" aria-label="HK Bau Kennzahlen"><article><span>Schwerpunkt</span><strong>${s.focus}</strong></article><article><span>Region</span><strong>${city} & Umgebung</strong></article><article><span>Standorte</span><strong>Fellbach & Magstadt</strong></article><article><span>Anfrage</span><strong>Direkt erreichbar</strong></article></section>
  <section class="seo-split"><div data-aos="fade-up"><span class="seo-kicker">${s.label} ${city}</span><h2>${s.splitH2(city)}</h2></div><div class="seo-copy" data-aos="fade-up" data-aos-delay="100"><p>${s.splitP1(city)}</p><p>${s.splitP2(city, c.regionShort)}</p></div></section>
  <section class="seo-services"><div class="seo-section-head" data-aos="fade-up"><span class="seo-kicker">Leistungen</span><h2>Ein Ansprechpartner für die entscheidenden Bauphasen.</h2><p>Direkte Einstiege zu den wichtigsten Leistungsbereichen und passenden Referenzen.</p></div><div class="seo-service-grid">${otherSvcCards}</div></section>
  <section class="seo-region"><div data-aos="fade-up"><span class="seo-kicker">Region ${city}</span><h2>Nicht nur ${city}. Der relevante Radius zählt.</h2><p>HK Bau arbeitet in ${city} und im erweiterten Umkreis. Wichtig sind dabei kurze Abstimmung, passende Kapazitäten und ein klarer Leistungsumfang.</p></div><div class="seo-region__list" data-aos="fade-up" data-aos-delay="100"><span>${city}</span>${c.region.map((r) => `<span>${r}</span>`).join("")}</div></section>
  <section class="seo-faq"><div class="seo-section-head" data-aos="fade-up"><span class="seo-kicker">FAQ</span><h2>Häufige Fragen vor Projektstart.</h2></div><details open><summary>${faq[0][0]}</summary><p>${faq[0][1]}</p></details><details><summary>${faq[1][0]}</summary><p>${faq[1][1]}</p></details><details><summary>${faq[2][0]}</summary><p>${faq[2][1]}</p></details></section>
  <section class="city-neighbors" data-aos="fade-up"><div class="seo-section-head"><span class="seo-kicker">Weitere Einsatzgebiete</span><h2>${s.label} auch in diesen Städten.</h2><p>HK Bau ist in der gesamten Region Stuttgart für ${s.label}-Projekte verfügbar.</p></div><div class="city-neighbors__grid">${c.neighbors.map((n) => `<a href="${n[0]}">${n[1]}</a>`).join("")}</div></section>
  <section class="seo-cta" data-aos="fade-up"><div><span class="seo-kicker">Projekt geplant?</span><h2>Direkt mit HK Bau sprechen.</h2><p>Beschreiben Sie kurz Ihr ${s.label}-Vorhaben in ${city} oder Umgebung. Wir melden uns mit einer klaren ersten Einschätzung.</p></div><a href="../kontakt.html">Anfrage senden</a></section>
</main>
<footer class="premium-footer" data-aos="fade-in"><div class="premium-footer__top"><div class="premium-footer__brand"><div class="premium-footer__logo-row"><img src="../images/icon/logo.png" alt="HK Bau Logo" width="64" height="64" /><div><span>HK Bau</span><strong>Wo Vision auf Fundament trifft.</strong></div></div><p>Bauunternehmen für Rohbau, Hochbau, Tiefbau und schlüsselfertiges Bauen in Stuttgart und Umgebung. Zwei Standorte, direkte Ansprechpartner und echte Projektbeispiele aus der Region.</p></div></div><div class="premium-footer__main"><nav class="premium-footer__column" aria-label="Footer Leistungen"><h3>Leistungen</h3><a href="../leistungen.html#erdbau-details">Erdbau</a><a href="../leistungen.html#kanalbau-details">Kanalbau</a><a href="../leistungen.html#stahlbetonbau-details">Stahlbetonbau</a><a href="../leistungen.html#mauerwerksbau-details">Mauerwerksbau</a><a href="../leistungen.html#schluesselfertigbau-details">Schlüsselfertigbau</a></nav><nav class="premium-footer__column" aria-label="Footer Referenzen"><h3>Referenzen</h3><a href="../referenzen-galerie/stahlbetonbau.html">Stahlbetonbau Referenzen</a><a href="../referenzen-galerie/kanalbau.html">Kanalbau Referenzen</a><a href="../referenzen-galerie/erdbau.html">Erdbau Referenzen</a><a href="../referenzen-galerie/holzbau.html">Holz- & Stahlbau Referenzen</a><a href="../referenzen.html">Alle Bauprojekte</a><a href="../aktuelles.html">Aktuelles</a></nav><div class="premium-footer__column premium-footer__contact"><h3>Kontakt</h3><a href="mailto:info@hk-bau.net"><i class="fas fa-envelope"></i> info@hk-bau.net</a><span><i class="fas fa-location-dot"></i> Esslinger Str. 91, 70734 Fellbach</span><a href="tel:+4971190652700"><i class="fas fa-phone"></i> 0711 / 90 65 27 0</a><span><i class="fas fa-location-dot"></i> Blumenstraße 33a, 71106 Magstadt</span><a href="tel:+4971594591823"><i class="fas fa-phone"></i> 07159 / 459 18 23</a></div></div><div class="premium-footer__bottom"><p>&copy; <span class="current-year"></span> H+K Bauunternehmung GmbH. Alle Rechte vorbehalten.</p><nav aria-label="Rechtliches"><a href="../impressum.html">Impressum</a><a href="../datenschutzerklaerung.html">Datenschutz</a><button type="button" class="footer-legal-cookie" data-cookie-settings>Cookie-Einstellungen</button></nav></div></footer>
<button id="scrollToTopBtn" class="hidden fixed bottom-6 right-6 bg-primary-color text-secondary-color p-3 rounded-full shadow-lg hover:bg-primary-hover transition z-50" aria-label="Nach oben scrollen"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg></button>
</body>
</html>
`;
}

const urls = [];
let n = 0;
for (const svc of Object.keys(SERVICES)) {
  for (const city of Object.keys(CITIES)) {
    const slug = `${svc}-${city}`;
    fs.writeFileSync(path.join(OUT, `${slug}.html`), page(svc, city));
    urls.push(slug);
    n++;
  }
}
console.log(`${n} combo pages written.`);
console.log(urls.join("\n"));
