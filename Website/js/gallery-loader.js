const galleryConfigs = {
  "abbruch-referenzen": [{ prefix: "1.abbruch_", count: 19 }],
  "aussenanlagen-referenzen": [{ prefix: "1.aussenanlagen_", count: 19 }],
  "erdbau-referenzen": [
    { prefix: "1.erdbau_", count: 20 },
    { prefix: "2.erdbau_", count: 39 }
  ],
  "kanalbau-referenzen": [
    { prefix: "1.kanalbau_", count: 17 },
    { prefix: "2.kanalbau_", count: 51 }
  ],
  "holzbau-referenzen": [
    { prefix: "1.holzbau_", count: 85 },
    { prefix: "2.holzbau_", count: 61 }
  ],
  "mauerwerksbau-referenzen": [
    { prefix: "1.mauerwerksbau_", count: 8 },
    { prefix: "2.mauerwerksbau_", count: 21 }
  ],
  "stahlbetonbau-referenzen": [
    { prefix: "1.stahlbetonbau_", count: 278 },
    { prefix: "2.stahlbetonbau_", count: 138 }
  ]
};

const INITIAL_COUNT = 20;
const BATCH_SIZE = 20;

function buildFileList(groups) {
  const files = [];
  groups.forEach(({ prefix, count }) => {
    for (let i = 1; i <= count; i++) {
      files.push(`${prefix}${i}.jpg`);
    }
  });
  return files;
}

function createImageLink(folder, file, index) {
  const link = document.createElement("a");
  link.href = `../images/${folder}/${file}`;
  link.className =
    "glightbox block overflow-hidden rounded-xl transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:z-10";
  link.setAttribute("data-aos", "zoom-in");
  const delay = Math.min((index + 1) * 50, 1000);
  link.setAttribute("data-aos-delay", `${delay}`);
  link.setAttribute("aria-label", `${folder} Bild ${index + 1}`);

  const img = document.createElement("img");
  img.src = `../images/${folder}/${file}`;
  img.alt = `${folder} ${index + 1}`;
  img.loading = "lazy";
  img.className = "w-full h-auto";

  link.appendChild(img);
  return link;
}

function appendBatch(gallery, folder, files, startIndex) {
  files.forEach((file, i) => {
    const link = createImageLink(folder, file, startIndex + i);
    const sentinel = gallery.querySelector('.gallery-sentinel');
    if (sentinel) {
      gallery.insertBefore(link, sentinel);
    } else {
      gallery.appendChild(link);
    }
  });

  if (typeof initLightbox === 'function') {
    initLightbox();
  }

  if (window.AOS && typeof AOS.refresh === 'function') {
    AOS.refresh();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".gallery[data-folder]").forEach(gallery => {
    const folder = gallery.dataset.folder;
    const config = galleryConfigs[folder];
    if (!config) return;

    const files = buildFileList(config);
    const remaining = files.slice(INITIAL_COUNT);

    gallery._remainingFiles = remaining;
    gallery._loadedCount = 0;

    appendBatch(gallery, folder, files.slice(0, INITIAL_COUNT), 0);
    gallery._loadedCount += Math.min(INITIAL_COUNT, files.length);

    if (remaining.length > 0) {
      const sentinel = document.createElement('div');
      sentinel.className = 'gallery-sentinel';
      sentinel.style.height = '1px';
      sentinel.style.width = '100%';
      sentinel.style.visibility = 'hidden';
      gallery.appendChild(sentinel);

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            const nextBatch = gallery._remainingFiles.splice(0, BATCH_SIZE);
            if (nextBatch.length) {
              appendBatch(gallery, folder, nextBatch, gallery._loadedCount);
              gallery._loadedCount += nextBatch.length;
            }
            if (gallery._remainingFiles.length > 0) {
              gallery.appendChild(sentinel);
              observer.observe(sentinel);
            } else {
              sentinel.remove();
            }
          }
        });
      });

      observer.observe(sentinel);
    }
  });
});
