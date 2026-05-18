/**
 * Lightweight interactivity for pre-rendered post pages (built by
 * scripts/build-posts.js).
 *
 * The HTML for hero, gallery markup, body and post nav is
 * already in the page. This script only:
 *   - wires up gallery prev/next, thumb clicks, keyboard arrows
 *
 * No XHR. No DOM rendering. No SEO meta updates (all baked in by build).
 */
(function () {
  'use strict';

  /* Gather gallery state from the DOM (built by scripts/build-posts.js) */
  var thumbs = document.querySelectorAll('.post-gallery__thumb');
  var galleryImages = [];
  if (thumbs.length > 1) {
    thumbs.forEach(function (t) { galleryImages.push(t.src); });
  }
  var galleryIndex = 0;

  function resetHorizontalScroll() {
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
  }

  function galleryNav(dir) {
    if (!galleryImages.length) return;
    var idx = galleryIndex + dir;
    if (idx < 0) idx = galleryImages.length - 1;
    if (idx >= galleryImages.length) idx = 0;
    galleryGo(idx);
  }

  function galleryGo(idx) {
    if (!galleryImages.length) return;
    galleryIndex = idx;

    var main = document.getElementById('gallery-main');
    var counter = document.getElementById('gallery-counter');

    if (main) main.src = galleryImages[idx];
    if (counter) counter.textContent = (idx + 1) + ' / ' + galleryImages.length;
    thumbs.forEach(function (t, i) {
      t.classList.toggle('active', i === idx);
    });

    if (thumbs[idx]) {
      var scroller = thumbs[idx].parentElement;
      if (scroller && typeof scroller.scrollTo === 'function') {
        scroller.scrollTo({
          left: thumbs[idx].offsetLeft - (scroller.clientWidth / 2) + (thumbs[idx].clientWidth / 2),
          behavior: 'smooth'
        });
      }
    }

    resetHorizontalScroll();
  }

  /* Delegated click handler on the article */
  var article = document.getElementById('post-content');
  if (article) {
    article.addEventListener('click', function (e) {

      var navBtn = e.target.closest('[data-gallery-dir]');
      if (navBtn) {
        e.preventDefault();
        e.stopPropagation();
        galleryNav(parseInt(navBtn.getAttribute('data-gallery-dir'), 10));
        return;
      }

      var thumb = e.target.closest('.post-gallery__thumb');
      if (thumb) {
        e.preventDefault();
        e.stopPropagation();
        galleryGo(parseInt(thumb.getAttribute('data-index'), 10));
        return;
      }
    });
  }

  /* Keyboard navigation */
  document.addEventListener('keydown', function (e) {
    if (!galleryImages.length) return;
    if (e.key === 'ArrowLeft') galleryNav(-1);
    if (e.key === 'ArrowRight') galleryNav(1);
  });
})();
