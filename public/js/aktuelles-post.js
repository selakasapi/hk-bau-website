/**
 * Aktuelles Post Page Renderer
 * Reads ?id=xxx from URL, finds the post in data/aktuelles.json,
 * and renders the full post with image gallery.
 */
(function () {
  'use strict';

  var DATA_URL = '../data/aktuelles.json';
  var SITE_ORIGIN = 'https://www.hk-bau.com';

  /* HTML escape — prevents broken layout / XSS when post text contains <, >, &, ", ' */
  function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* Escape for use inside double-quoted HTML attributes */
  function escapeAttr(str) {
    return escapeHTML(str);
  }

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    var months = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    return d.getDate() + '. ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  function getPostId() {
    var params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  function updateSEO(post) {
    var url = SITE_ORIGIN + '/aktuelles/post.html?id=' + encodeURIComponent(post.id);
    var title = post.titel + ' – HK Bau';
    var desc = post.kurz || (post.text || '').substring(0, 160);
    var img = SITE_ORIGIN + '/' + (post.bild || 'images/og-preview.jpg');

    document.title = title;

    function setAttr(id, attr, val) {
      var el = document.getElementById(id);
      if (el) el.setAttribute(attr, val);
    }
    function setMeta(name, val) {
      var el = document.querySelector('meta[name="' + name + '"]');
      if (el) el.content = val;
    }

    setMeta('description', desc);
    setAttr('post-canonical', 'href', url);
    setAttr('og-url', 'content', url);
    setAttr('og-title', 'content', title);
    setAttr('og-description', 'content', desc);
    setAttr('og-image', 'content', img);
    setAttr('tw-title', 'content', title);
    setAttr('tw-description', 'content', desc);
    setAttr('tw-image', 'content', img);

    /* JSON-LD NewsArticle */
    var jsonld = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": post.titel,
      "description": desc,
      "image": img,
      "datePublished": post.datum,
      "dateModified": post.datum,
      "url": url,
      "mainEntityOfPage": { "@type": "WebPage", "@id": url },
      "author": { "@type": "Organization", "name": "HK Bau GmbH", "url": SITE_ORIGIN },
      "publisher": {
        "@type": "Organization",
        "name": "HK Bau GmbH",
        "logo": { "@type": "ImageObject", "url": SITE_ORIGIN + "/images/icon/logo.png" }
      }
    };
    var ldEl = document.getElementById('post-jsonld');
    if (ldEl) ldEl.textContent = JSON.stringify(jsonld);
  }

  function buildShareButtons() {
    var url = window.location.href;
    var whatsappUrl = 'https://wa.me/?text=' + encodeURIComponent(document.title + ' ' + url);

    return '<div class="post-share" data-aos="fade-up">' +
      '<span class="post-share__label">Teilen:</span>' +
      '<a href="' + whatsappUrl + '" target="_blank" rel="noopener noreferrer" class="post-share__btn post-share__btn--whatsapp">' +
        '<i class="fab fa-whatsapp"></i> WhatsApp' +
      '</a>' +
      '<button class="post-share__btn post-share__btn--copy" onclick="copyPostLink(this)">' +
        '<i class="fas fa-link"></i> Link kopieren' +
      '</button>' +
    '</div>';
  }

  function buildPostNav(posts, currentId) {
    var idx = -1;
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].id === currentId) { idx = i; break; }
    }
    if (idx === -1) return '';

    var prev = idx < posts.length - 1 ? posts[idx + 1] : null;
    var next = idx > 0 ? posts[idx - 1] : null;

    var html = '<nav class="post-nav" data-aos="fade-up">';

    if (prev) {
      html += '<a href="post.html?id=' + encodeURIComponent(prev.id) + '" class="post-nav__link post-nav__link--prev">' +
        '<span class="post-nav__icon"><i class="fas fa-arrow-left"></i></span>' +
        '<span class="post-nav__text">' +
          '<span class="post-nav__label">Vorheriger Beitrag</span>' +
          '<span class="post-nav__title">' + escapeHTML(prev.titel) + '</span>' +
        '</span>' +
      '</a>';
    } else {
      html += '<span class="post-nav__link post-nav__link--placeholder"></span>';
    }

    if (next) {
      html += '<a href="post.html?id=' + encodeURIComponent(next.id) + '" class="post-nav__link post-nav__link--next">' +
        '<span class="post-nav__icon"><i class="fas fa-arrow-right"></i></span>' +
        '<span class="post-nav__text">' +
          '<span class="post-nav__label">Nächster Beitrag</span>' +
          '<span class="post-nav__title">' + escapeHTML(next.titel) + '</span>' +
        '</span>' +
      '</a>';
    } else {
      html += '<span class="post-nav__link post-nav__link--placeholder"></span>';
    }

    html += '</nav>';
    return html;
  }

  window.copyPostLink = function (btn) {
    var url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        btn.classList.add('copied');
        btn.innerHTML = '<i class="fas fa-check"></i> Kopiert!';
        setTimeout(function () {
          btn.classList.remove('copied');
          btn.innerHTML = '<i class="fas fa-link"></i> Link kopieren';
        }, 2000);
      });
    }
  };

  function renderPost(post, allPosts) {
    var el = document.getElementById('post-content');
    if (!el) return;

    /* Update SEO meta + JSON-LD */
    updateSEO(post);

    /* Populate hero header */
    var heroDate = document.getElementById('post-hero-date');
    var heroTitle = document.getElementById('post-hero-title');
    if (heroDate) heroDate.innerHTML = '<i class="far fa-calendar-alt"></i> ' + formatDate(post.datum);
    if (heroTitle) heroTitle.textContent = post.titel;

    /* Build gallery */
    var images = post.bilder || [post.bild];
    var galleryHTML = '';

    var titleAttr = escapeAttr(post.titel);

    if (images.length === 1) {
      galleryHTML =
        '<div class="post-hero-img">' +
          '<img src="../' + escapeAttr(images[0]) + '" alt="' + titleAttr + '" width="1200" height="800" loading="eager" fetchpriority="high" />' +
        '</div>';
    } else {
      /* Main image */
      galleryHTML =
        '<div class="post-gallery">' +
          '<div class="post-gallery__main">' +
            '<img id="gallery-main" src="../' + escapeAttr(images[0]) + '" alt="' + titleAttr + '" width="1200" height="800" loading="eager" fetchpriority="high" />' +
            '<button class="post-gallery__nav post-gallery__nav--prev" onclick="galleryNav(-1)" aria-label="Vorheriges Bild"><i class="fas fa-chevron-left"></i></button>' +
            '<button class="post-gallery__nav post-gallery__nav--next" onclick="galleryNav(1)" aria-label="Nächstes Bild"><i class="fas fa-chevron-right"></i></button>' +
            '<span class="post-gallery__counter" id="gallery-counter">1 / ' + images.length + '</span>' +
          '</div>' +
          '<div class="post-gallery__thumbs" id="gallery-thumbs">';

      for (var i = 0; i < images.length; i++) {
        galleryHTML +=
          '<img src="../' + escapeAttr(images[i]) + '" alt="Bild ' + (i + 1) + '" class="post-gallery__thumb' + (i === 0 ? ' active' : '') + '" width="76" height="56" data-index="' + i + '" onclick="galleryGo(' + i + ')" loading="lazy" />';
      }

      galleryHTML += '</div></div>';
    }

    /* Format text with line breaks (escape first, then convert newlines to <br>) */
    var formattedText = (post.text || '')
      .split('\n\n')
      .map(function (para) {
        return '<p>' + escapeHTML(para).replace(/\n/g, '<br>') + '</p>';
      })
      .join('');

    el.innerHTML =
      '<div class="post-header" data-aos="fade-up">' +
        '<time datetime="' + escapeAttr(post.datum) + '"><i class="far fa-calendar-alt"></i> ' + escapeHTML(formatDate(post.datum)) + '</time>' +
        '<h1>' + escapeHTML(post.titel) + '</h1>' +
      '</div>' +
      galleryHTML +
      '<div class="post-body" data-aos="fade-up">' +
        formattedText +
      '</div>' +
      (post.fb ?
        '<div class="post-fb" data-aos="fade-up">' +
          '<a href="' + escapeAttr(post.fb) + '" target="_blank" rel="noopener noreferrer">' +
            '<i class="fab fa-facebook-f"></i> Diesen Beitrag auf Facebook ansehen' +
          '</a>' +
        '</div>' : '') +
      buildShareButtons() +
      buildPostNav(allPosts, post.id);

    /* Gallery state */
    if (images.length > 1) {
      window._galleryImages = images.map(function (img) { return '../' + img; });
      window._galleryIndex = 0;
    }

    /* Trigger AOS */
    if (typeof AOS !== 'undefined') AOS.refresh();
  }

  /* Gallery navigation */
  window.galleryNav = function (dir) {
    var imgs = window._galleryImages;
    if (!imgs) return;
    var idx = window._galleryIndex + dir;
    if (idx < 0) idx = imgs.length - 1;
    if (idx >= imgs.length) idx = 0;
    galleryGo(idx);
  };

  window.galleryGo = function (idx) {
    var imgs = window._galleryImages;
    if (!imgs) return;
    window._galleryIndex = idx;

    var main = document.getElementById('gallery-main');
    var counter = document.getElementById('gallery-counter');
    var thumbs = document.querySelectorAll('.post-gallery__thumb');

    if (main) main.src = imgs[idx];
    if (counter) counter.textContent = (idx + 1) + ' / ' + imgs.length;
    thumbs.forEach(function (t, i) {
      t.classList.toggle('active', i === idx);
    });

    /* Scroll active thumb into view */
    if (thumbs[idx]) {
      thumbs[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  /* Keyboard navigation */
  document.addEventListener('keydown', function (e) {
    if (!window._galleryImages) return;
    if (e.key === 'ArrowLeft') galleryNav(-1);
    if (e.key === 'ArrowRight') galleryNav(1);
  });

  function showError(msg) {
    var el = document.getElementById('post-content');
    if (el) el.innerHTML = '<p class="aktuelles-error"><i class="fas fa-exclamation-triangle"></i> ' + msg + '</p>';
  }

  function init() {
    var postId = getPostId();
    if (!postId) {
      showError('Kein Beitrag angegeben.');
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', DATA_URL, true);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var posts = JSON.parse(xhr.responseText);
          var post = null;
          for (var i = 0; i < posts.length; i++) {
            if (posts[i].id === postId) { post = posts[i]; break; }
          }
          if (post) {
            renderPost(post, posts);
          } else {
            showError('Beitrag nicht gefunden.');
          }
        } catch (e) {
          showError('Fehler beim Laden des Beitrags.');
        }
      }
    };
    xhr.send();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
