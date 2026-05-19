/**
 * Build script — generates static HTML pages for each aktuelles post.
 *
 * Why: post.html?id=xxx renders content via JavaScript. Google's first-pass
 * crawler doesn't run JS, so post content/title/OG aren't seen until the
 * slower second pass. Pre-rendering makes content visible in the initial
 * HTML response → better/faster indexing.
 *
 * Input:  public/data/aktuelles.json
 *         public/aktuelles/post.html  (used as template)
 * Output: public/aktuelles/<post-id>.html  (one per post)
 *
 * The generated files have:
 *   - Title, description, canonical, OG, Twitter, JSON-LD all baked in
 *   - Hero header (date + title) baked in
 *   - Gallery markup baked in (JS only wires up click handlers)
 *   - Body text baked in (paragraphs)
 *   - Post nav baked in
 *
 * aktuelles-post.js is replaced with a smaller `aktuelles-post-static.js`
 * that only handles gallery interactivity (click handlers + keyboard nav).
 *
 * Run: node scripts/build-posts.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public');
const SITE_ORIGIN = 'https://www.hk-bau.com';
const DATA_PATH = path.join(ROOT, 'data', 'aktuelles.json');
const TEMPLATE_PATH = path.join(ROOT, 'aktuelles', 'post.html');
const OUT_DIR = path.join(ROOT, 'aktuelles');

/* HTML escape */
function escapeHTML(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(iso) {
  const months = ['Januar','Februar','März','April','Mai','Juni',
                  'Juli','August','September','Oktober','November','Dezember'];
  const d = new Date(iso + 'T00:00:00');
  return d.getDate() + '. ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

/* Derive the small strip-thumbnail path from a full image path.
   e.g. images/aktuelles/2026.02.27-1.webp -> images/aktuelles/2026.02.27-1-thumb.webp
   Falls back to the full image if the -thumb file doesn't exist on disk. */
function toThumb(imagePath) {
  const fullDiskPath = path.join(ROOT, imagePath);
  const ext = path.extname(imagePath);
  const thumbPath = imagePath.slice(0, -ext.length) + '-thumb.webp';
  const thumbDiskPath = path.join(ROOT, thumbPath);
  return fs.existsSync(thumbDiskPath) ? thumbPath : imagePath;
}

function buildGalleryHTML(post) {
  const titleAttr = escapeHTML(post.titel);
  const images = post.bilder || [post.bild];

  if (images.length === 1) {
    return `      <div class="post-hero-img">
        <img src="../${escapeHTML(images[0])}" alt="${titleAttr}" width="1200" height="800" loading="eager" fetchpriority="high" />
      </div>`;
  }

  let thumbs = '';
  for (let i = 0; i < images.length; i++) {
    /* Use the small thumb variant — was downloading the full 200-450 KB image
       just to display a 76x56 strip thumbnail */
    const thumbSrc = toThumb(images[i]);
    thumbs += `          <img src="../${escapeHTML(thumbSrc)}" alt="Bild ${i + 1}" class="post-gallery__thumb${i === 0 ? ' active' : ''}" width="76" height="56" data-index="${i}" data-full="../${escapeHTML(images[i])}" loading="lazy" />\n`;
  }

  return `      <div class="post-gallery">
        <div class="post-gallery__main">
          <img id="gallery-main" src="../${escapeHTML(images[0])}" alt="${titleAttr}" width="1200" height="800" loading="eager" fetchpriority="high" />
          <button class="post-gallery__nav post-gallery__nav--prev" type="button" data-gallery-dir="-1" aria-label="Vorheriges Bild"><i class="fas fa-chevron-left"></i></button>
          <button class="post-gallery__nav post-gallery__nav--next" type="button" data-gallery-dir="1" aria-label="Nächstes Bild"><i class="fas fa-chevron-right"></i></button>
          <span class="post-gallery__counter" id="gallery-counter">1 / ${images.length}</span>
        </div>
        <div class="post-gallery__thumbs" id="gallery-thumbs">
${thumbs}        </div>
      </div>`;
}

function buildBodyHTML(post) {
  const paras = (post.text || '').split('\n\n').map(p =>
    `<p>${escapeHTML(p).replace(/\n/g, '<br>')}</p>`
  ).join('');
  return paras;
}

function buildFBHTML(post) {
  if (!post.fb) return '';
  return `      <div class="post-fb" data-aos="fade-up">
        <a href="${escapeHTML(post.fb)}" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-facebook-f"></i> Diesen Beitrag auf Facebook ansehen
        </a>
      </div>`;
}

function buildPostNavHTML(posts, currentId) {
  const idx = posts.findIndex(p => p.id === currentId);
  if (idx === -1) return '';

  const prev = idx < posts.length - 1 ? posts[idx + 1] : null; // older
  const next = idx > 0 ? posts[idx - 1] : null; // newer

  let html = `      <nav class="post-nav" data-aos="fade-up">\n`;

  if (prev) {
    html += `        <a href="${escapeHTML(prev.id)}.html" class="post-nav__link post-nav__link--prev">
          <span class="post-nav__icon"><i class="fas fa-arrow-left"></i></span>
          <span class="post-nav__text">
            <span class="post-nav__label">Vorheriger Beitrag</span>
            <span class="post-nav__title">${escapeHTML(prev.titel)}</span>
          </span>
        </a>\n`;
  } else {
    html += `        <span class="post-nav__link post-nav__link--placeholder"></span>\n`;
  }

  if (next) {
    html += `        <a href="${escapeHTML(next.id)}.html" class="post-nav__link post-nav__link--next">
          <span class="post-nav__icon"><i class="fas fa-arrow-right"></i></span>
          <span class="post-nav__text">
            <span class="post-nav__label">Nächster Beitrag</span>
            <span class="post-nav__title">${escapeHTML(next.titel)}</span>
          </span>
        </a>\n`;
  } else {
    html += `        <span class="post-nav__link post-nav__link--placeholder"></span>\n`;
  }

  html += `      </nav>`;
  return html;
}

function buildPostPage(post, allPosts, template) {
  const url = `${SITE_ORIGIN}/aktuelles/${post.id}.html`;
  const title = `${post.titel} – HK Bau`;
  const desc = post.kurz || (post.text || '').substring(0, 160);
  const img = `${SITE_ORIGIN}/${post.bild || 'images/og-preview.jpg'}`;
  const formattedDate = formatDate(post.datum);

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.titel,
    description: desc,
    image: img,
    datePublished: post.datum,
    dateModified: post.datum,
    url: url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: 'HK Bau GmbH', url: SITE_ORIGIN },
    publisher: {
      '@type': 'Organization',
      name: 'HK Bau GmbH',
      logo: { '@type': 'ImageObject', url: SITE_ORIGIN + '/images/icon/logo.png' }
    }
  };

  let html = template;

  /* Replace title, description, canonical, OG, Twitter, JSON-LD */
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHTML(title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${escapeHTML(desc)}"`);
  html = html.replace(/<link rel="canonical" id="post-canonical" href="[^"]*"/, `<link rel="canonical" id="post-canonical" href="${url}"`);

  html = html.replace(/<meta property="og:url" id="og-url" content="[^"]*"/, `<meta property="og:url" id="og-url" content="${url}"`);
  html = html.replace(/<meta property="og:title" id="og-title" content="[^"]*"/, `<meta property="og:title" id="og-title" content="${escapeHTML(title)}"`);
  html = html.replace(/<meta property="og:description" id="og-description" content="[^"]*"/, `<meta property="og:description" id="og-description" content="${escapeHTML(desc)}"`);
  html = html.replace(/<meta property="og:image" id="og-image" content="[^"]*"/, `<meta property="og:image" id="og-image" content="${img}"`);
  html = html.replace(/<meta name="twitter:title" id="tw-title" content="[^"]*"/, `<meta name="twitter:title" id="tw-title" content="${escapeHTML(title)}"`);
  html = html.replace(/<meta name="twitter:description" id="tw-description" content="[^"]*"/, `<meta name="twitter:description" id="tw-description" content="${escapeHTML(desc)}"`);
  html = html.replace(/<meta name="twitter:image" id="tw-image" content="[^"]*"/, `<meta name="twitter:image" id="tw-image" content="${img}"`);

  html = html.replace(/<script type="application\/ld\+json" id="post-jsonld"><\/script>/, `<script type="application/ld+json" id="post-jsonld">${JSON.stringify(jsonld)}</script>`);

  /* Replace hero header content */
  html = html.replace(/<div class="post-page-hero__date" id="post-hero-date"><\/div>/, `<div class="post-page-hero__date" id="post-hero-date"><i class="far fa-calendar-alt"></i> ${escapeHTML(formattedDate)}</div>`);
  html = html.replace(/<h1 class="post-page-hero__title" id="post-hero-title"><\/h1>/, `<h1 class="post-page-hero__title" id="post-hero-title">${escapeHTML(post.titel)}</h1>`);

  /* Replace article placeholder with full rendered content */
  const articleContent = `<article class="post-article" id="post-content">
${buildGalleryHTML(post)}
      <div class="post-body" data-aos="fade-up">${buildBodyHTML(post)}</div>
${buildFBHTML(post)}
${buildPostNavHTML(allPosts, post.id)}
    </article>`;

  html = html.replace(/<article class="post-article" id="post-content">[\s\S]*?<\/article>/, articleContent);

  /* Swap the dynamic renderer for the static interactivity-only script */
  html = html.replace(/<script src="\.\.\/js\/aktuelles-post\.js[^"]*" defer><\/script>/, `<script src="../js/aktuelles-post-static.js?v=1" defer></script>`);

  return html;
}

/* MAIN */
const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

console.log(`Generating ${data.length} static post pages...\n`);

for (const post of data) {
  const out = buildPostPage(post, data, template);
  const outPath = path.join(OUT_DIR, `${post.id}.html`);
  fs.writeFileSync(outPath, out);
  console.log(`  ${path.relative(ROOT, outPath)}  (${(out.length / 1024).toFixed(1)} KB)`);
}

console.log(`\nDone. ${data.length} files written.`);
console.log(`Next: ensure public/js/aktuelles-post-static.js exists (interactivity only).`);
