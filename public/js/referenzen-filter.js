/**
 * Reference grid filter — toggles visibility of .reference-card elements
 * by data-category, driven by .ref-filter buttons.
 */
(function () {
  'use strict';

  function init() {
    var filters = document.querySelectorAll('.ref-filter');
    var cards = document.querySelectorAll('.reference-card');
    if (!filters.length || !cards.length) return;

    filters.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.dataset.filter;
        filters.forEach(function (item) { item.classList.remove('active'); });
        button.classList.add('active');
        cards.forEach(function (card) {
          var show = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
