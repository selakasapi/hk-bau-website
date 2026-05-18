/**
 * Aktuelles (News) Renderer
 * Reads data/aktuelles.json and renders cards on both:
 *   - aktuelles.html  →  #aktuelles-list   (all posts – featured first)
 *   - index.html      →  #aktuelles-home   (latest 3)
 *
 * Each card links to its own post page with full text + gallery.
 */
(function () {
  'use strict';

  var DATA_URL = 'data/aktuelles.json';

  /* ── helpers ──────────────────────────────────── */

  function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    var months = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    return d.getDate() + '. ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  function imgCountBadge(post) {
    var count = (post.bilder && post.bilder.length > 1) ? post.bilder.length : 0;
    if (!count) return '';
    return '<span class="aktuelles-card__img-count"><i class="fas fa-camera"></i> ' + count + '</span>';
  }

  /* ── card builder ────────────────────────────── */

  function buildCard(post, isHome) {
    var wrapper = document.createElement('a');
    wrapper.className = 'aktuelles-card' + (isHome ? ' aktuelles-card--home' : '');
    wrapper.setAttribute('data-aos', 'fade-up');
    wrapper.href = 'aktuelles/' + encodeURIComponent(post.id) + '.html';
    var cardImage = post.thumb || post.bild;
    var loading = isHome ? 'eager' : 'lazy';
    var fetchPriority = isHome ? ' fetchpriority="low"' : '';

    wrapper.innerHTML =
      '<div class="aktuelles-card__img-wrap">' +
        '<img src="' + escapeHTML(cardImage) + '" alt="' + escapeHTML(post.titel) + '" width="720" height="450" loading="' + loading + '" decoding="async"' + fetchPriority + ' />' +
        imgCountBadge(post) +
      '</div>' +
      '<div class="aktuelles-card__body">' +
        '<time datetime="' + escapeHTML(post.datum) + '"><i class="far fa-calendar-alt"></i> ' + escapeHTML(formatDate(post.datum)) + '</time>' +
        '<h3>' + escapeHTML(post.titel) + '</h3>' +
        '<p>' + escapeHTML(post.kurz || post.text) + '</p>' +
        '<div class="aktuelles-card__footer">' +
          '<span class="aktuelles-card__fb-hint"><i class="fas fa-arrow-right"></i> Weiterlesen</span>' +
        '</div>' +
      '</div>';

    return wrapper;
  }

  /* ── featured card (full page only) ──────────── */

  function buildFeatured(post) {
    var wrapper = document.createElement('a');
    wrapper.className = 'aktuelles-featured';
    wrapper.setAttribute('data-aos', 'fade-up');
    wrapper.href = 'aktuelles/' + encodeURIComponent(post.id) + '.html';

    var imgCount = (post.bilder && post.bilder.length > 1) ? post.bilder.length : 0;
    var imgBadge = imgCount ? '<span class="aktuelles-featured__img-count"><i class="fas fa-camera"></i> ' + imgCount + ' Bilder</span>' : '';

    wrapper.innerHTML =
      '<div class="aktuelles-featured__img">' +
        '<img src="' + escapeHTML(post.bild) + '" alt="' + escapeHTML(post.titel) + '" width="800" height="600" loading="eager" fetchpriority="high" />' +
        '<div class="aktuelles-featured__overlay"></div>' +
        '<div class="aktuelles-featured__label"><i class="fas fa-star"></i> Neuester Beitrag</div>' +
        imgBadge +
      '</div>' +
      '<div class="aktuelles-featured__body">' +
        '<time datetime="' + escapeHTML(post.datum) + '"><i class="far fa-calendar-alt"></i> ' + escapeHTML(formatDate(post.datum)) + '</time>' +
        '<h2>' + escapeHTML(post.titel) + '</h2>' +
        '<p>' + escapeHTML(post.kurz || post.text) + '</p>' +
        '<div class="aktuelles-featured__actions">' +
          '<span class="aktuelles-featured__fb-btn"><i class="fas fa-arrow-right"></i> Weiterlesen</span>' +
        '</div>' +
      '</div>';

    return wrapper;
  }

  /* ── render ──────────────────────────────────── */

  function render(posts) {
    /* Full page */
    var listEl = document.getElementById('aktuelles-list');
    if (listEl) {
      if (posts.length === 0) {
        listEl.innerHTML = '<p class="aktuelles-empty">Noch keine Beiträge vorhanden.</p>';
      } else {
        /* Featured first post */
        var featuredWrap = document.getElementById('aktuelles-featured-wrap');
        if (featuredWrap && posts.length > 0) {
          featuredWrap.appendChild(buildFeatured(posts[0]));
        }

        /* Remaining posts in grid */
        var remaining = featuredWrap ? posts.slice(1) : posts;
        if (remaining.length === 0) {
          var gridTitle = document.getElementById('aktuelles-grid-title');
          if (gridTitle) gridTitle.style.display = 'none';
        }
        remaining.forEach(function (p) { listEl.appendChild(buildCard(p, false)); });
      }
    }

    /* Homepage – latest 3 */
    var homeEl = document.getElementById('aktuelles-home');
    if (homeEl) {
      var latest = posts.slice(0, 3);
      if (latest.length === 0) {
        homeEl.parentElement.style.display = 'none';
        return;
      }
      /* index.html ships a static fallback so cards are visible before JSON loads. */
      homeEl.innerHTML = '';
      latest.forEach(function (p) { homeEl.appendChild(buildCard(p, true)); });
    }
  }

  /* ── fetch ───────────────────────────────────── */

  function init() {
    /* Cache-bust by current date so newly added posts appear within 24h */
    var cacheBust = DATA_URL + '?v=20260518-2&d=' + (new Date()).toISOString().slice(0, 10);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', cacheBust, true);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var posts = JSON.parse(xhr.responseText);
          render(posts);
        } catch (e) {
          var listEl = document.getElementById('aktuelles-list');
          if (listEl) {
            listEl.innerHTML =
              '<p class="aktuelles-error"><i class="fas fa-exclamation-triangle"></i> Fehler beim Laden der Beiträge. Bitte JSON-Format prüfen.</p>';
          }
        }
      }
    };
    xhr.send();
  }

  /* Wait for DOM */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
