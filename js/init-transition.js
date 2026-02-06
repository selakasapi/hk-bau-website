(() => {
  if (sessionStorage.getItem('isTransitioning') === 'true') {
    document.documentElement.classList.add('is-transitioning');
  }
})();
