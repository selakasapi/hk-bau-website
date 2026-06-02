/**
 * gallery-core.js — shared post-gallery interactivity.
 *
 * Single source of truth for the aktuelles post image gallery behavior,
 * used by BOTH:
 *   - pre-rendered static post pages (public/aktuelles/<id>.html) — auto-inits
 *     on DOMContentLoaded since the gallery markup is already in the DOM.
 *   - the dynamic fallback renderer (js/aktuelles-post.js) — calls
 *     window.HKGallery.init() manually after it injects the markup.
 *
 * Reads the image list from the DOM: each .post-gallery__thumb carries the
 * full-resolution URL in data-full (its src is the small strip thumbnail).
 *
 * No inline handlers (CSP-friendly): a single delegated click listener on the
 * gallery root plus document-level keyboard arrows.
 */
(function () {
  'use strict';

  var images = [];
  var index = 0;
  var initialized = false;

  function collectImages() {
    var thumbs = document.querySelectorAll('.post-gallery__thumb');
    images = [];
    thumbs.forEach(function (t) {
      images.push(t.getAttribute('data-full') || t.src);
    });
    return thumbs;
  }

  function go(idx) {
    if (!images.length) return;
    index = idx;

    var main = document.getElementById('gallery-main');
    var counter = document.getElementById('gallery-counter');
    var thumbs = document.querySelectorAll('.post-gallery__thumb');

    if (main) main.src = images[idx];
    if (counter) counter.textContent = (idx + 1) + ' / ' + images.length;
    thumbs.forEach(function (t, i) { t.classList.toggle('active', i === idx); });

    /* Keep the active thumb centered in its own scroll container only —
       never touches document scroll (no page-level scrollLeft hacks). */
    var active = thumbs[idx];
    if (active) {
      var scroller = active.parentElement;
      if (scroller && typeof scroller.scrollTo === 'function') {
        scroller.scrollTo({
          left: active.offsetLeft - (scroller.clientWidth / 2) + (active.clientWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  }

  function nav(dir) {
    if (!images.length) return;
    var idx = index + dir;
    if (idx < 0) idx = images.length - 1;
    if (idx >= images.length) idx = 0;
    go(idx);
  }

  function onClick(e) {
    var navBtn = e.target.closest('[data-gallery-dir]');
    if (navBtn) {
      e.preventDefault();
      nav(parseInt(navBtn.getAttribute('data-gallery-dir'), 10));
      return;
    }
    var thumb = e.target.closest('.post-gallery__thumb');
    if (thumb) {
      e.preventDefault();
      go(parseInt(thumb.getAttribute('data-index'), 10));
    }
  }

  function init() {
    var thumbs = collectImages();
    if (thumbs.length < 2) return; /* single-image post: nothing to wire */

    var gallery = document.querySelector('.post-gallery');
    if (gallery && !gallery._hkWired) {
      gallery.addEventListener('click', onClick);
      gallery._hkWired = true;
    }

    if (!initialized) {
      document.addEventListener('keydown', function (e) {
        if (!images.length) return;
        if (e.key === 'ArrowLeft') nav(-1);
        else if (e.key === 'ArrowRight') nav(1);
      });
      initialized = true;
    }

    index = 0;
  }

  window.HKGallery = { init: init };

  /* Auto-init for static pre-rendered pages (gallery already in the DOM). */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
