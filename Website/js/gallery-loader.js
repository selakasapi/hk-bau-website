function initGallery(containerId, folderPath, filenames, prefix) {
  const container = document.getElementById(containerId);
  if (!container) return;
  filenames.forEach((name, idx) => {
    const link = document.createElement('a');
    link.href = `${folderPath}/${name}`;
    link.className = 'glightbox block overflow-hidden rounded-xl transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:z-10 relative';
    link.setAttribute('aria-label', `${prefix} Projekt ${idx + 1}`);

    const img = document.createElement('img');
    img.src = `${folderPath}/${name}`;
    img.alt = `${prefix} ${idx + 1}`;
    img.loading = 'lazy';
    img.className = 'w-full h-auto';

    const span = document.createElement('span');
    span.textContent = idx + 1;
    span.className = 'gallery-number absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded';

    link.appendChild(img);
    link.appendChild(span);
    container.appendChild(link);
  });
  if (typeof initLightbox === 'function') initLightbox();
}
window.initGallery = initGallery;
