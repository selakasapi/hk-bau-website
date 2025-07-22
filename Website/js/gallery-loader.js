// Optionally specify prefix patterns per folder to filter the loaded files
// e.g. { "folder-name": [ { prefix: "1.someprefix_" } ] }
const galleryConfigs = {};

const INITIAL_COUNT = 20;
const BATCH_SIZE = 20;
const THRESHOLD = 100;

function deriveCounts(total) {
  if (total > THRESHOLD) {
    const dynamicBatch = Math.ceil(total / 5);
    const initial = Math.max(INITIAL_COUNT, dynamicBatch);
    return { initial, batch: dynamicBatch };
  }
  return { initial: INITIAL_COUNT, batch: BATCH_SIZE };
}

let imageDimensions = {};

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function buildFileList(folder) {
  const dims = imageDimensions?.[folder];
  if (!dims) return [];
  let files = Object.keys(dims);

  const patterns = galleryConfigs[folder];
  if (Array.isArray(patterns) && patterns.length > 0) {
    files = files.filter(f => patterns.some(p => f.startsWith(p.prefix)));
  }

  return files.sort(naturalSort);
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
  img.src = `../images/${folder}/thumbs/${file}`;
  img.alt = `${folder} ${index + 1}`;
  img.loading = "lazy";
  img.className = "w-full h-auto";
  const dims = imageDimensions?.[folder]?.[file];
  if (dims) {
    img.width = dims.width;
    img.height = dims.height;
  }

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

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("../js/image-dimensions.json");
    if (res.ok) {
      imageDimensions = await res.json();
    }
  } catch (err) {
    console.error("Failed to load image dimensions", err);
  }

  document.querySelectorAll(".gallery[data-folder]").forEach(gallery => {
    const folder = gallery.dataset.folder;

    const files = buildFileList(folder);
    if (files.length === 0) return;
    const totalCount = files.length;
    const { initial, batch } = deriveCounts(totalCount);
    const remaining = files.slice(initial);

    gallery._remainingFiles = remaining;
    gallery._loadedCount = 0;
    gallery._batchSize = batch;

    appendBatch(gallery, folder, files.slice(0, initial), 0);
    gallery._loadedCount += Math.min(initial, files.length);

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
            const nextBatch = gallery._remainingFiles.splice(0, gallery._batchSize || BATCH_SIZE);
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
