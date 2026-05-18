// Optionally specify prefix patterns per folder to filter the loaded files
// e.g. { "folder-name": [ { prefix: "1.someprefix_" } ] }
const galleryConfigs = {};

const INITIAL_COUNT = 20;
const BATCH_SIZE = 20;
const THRESHOLD = 100;
const USE_THUMBNAILS = false;

function deriveCounts(total) {
  if (total > THRESHOLD) {
    const dynamicBatch = Math.ceil(total / 5);
    const initial = Math.max(INITIAL_COUNT, dynamicBatch);
    return { initial, batch: dynamicBatch };
  }
  return { initial: INITIAL_COUNT, batch: BATCH_SIZE };
}

let imageDimensions = {};

function getAltText(folder, file) {
  const alt = imageDimensions?.[folder]?.[file]?.alt;
  if (alt) return alt;
  const base = file.replace(/\.[^.]+$/, '').replace(/^\d+\./, '');
  return base.replace(/_/g, ' ');
}

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

/* Convert .jpg/.jpeg/.JPG path to .webp counterpart */
function toWebp(file) {
  return file.replace(/\.(jpe?g)$/i, '.webp');
}

function createImageLink(folder, file, index) {
  const webpFile = toWebp(file);
  const webpPath = `../images/${folder}/${webpFile}`;
  const jpgPath = `../images/${folder}/${file}`;

  const link = document.createElement("a");
  /* GLightbox modal loads the WebP (smaller, faster) */
  link.href = webpPath;
  /* No AOS — image fade-in via gallery-img-loaded CSS class on img.load gives a
     smoother, less janky experience than staggered card animations during scroll. */
  link.className =
    "glightbox gallery-thumb block overflow-hidden rounded-xl transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:z-10";
  link.setAttribute("aria-label", `${folder} Bild ${index + 1}`);

  /* <picture> with WebP source + JPG fallback (defensive — if WebP missing, browser uses JPG) */
  const picture = document.createElement("picture");
  const source = document.createElement("source");
  source.type = "image/webp";
  source.srcset = USE_THUMBNAILS
    ? `../images/${folder}/thumbs/${webpFile}`
    : webpPath;
  picture.appendChild(source);

  const img = document.createElement("img");
  img.src = USE_THUMBNAILS
    ? `../images/${folder}/thumbs/${file}`
    : jpgPath;
  if (USE_THUMBNAILS) {
    img.onerror = () => {
      img.onerror = null;
      img.src = jpgPath;
    };
  }
  img.alt = getAltText(folder, file);
  img.loading = index < 12 ? "eager" : "lazy";
  if (index === 0) {
    img.fetchPriority = "high";
  }
  img.decoding = "async";
  img.className = "w-full h-auto gallery-img";
  const dims = imageDimensions?.[folder]?.[file];
  if (dims) {
    img.width = dims.width;
    img.height = dims.height;
  }

  /* Smooth fade-in when the image actually finishes loading */
  const markLoaded = () => img.classList.add('is-loaded');
  if (img.complete && img.naturalHeight > 0) {
    markLoaded();
  } else {
    img.addEventListener('load', markLoaded, { once: true });
    img.addEventListener('error', markLoaded, { once: true });
  }
  picture.appendChild(img);

  link.appendChild(picture);
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
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("../js/image-dimensions.json");
    if (res.ok) {
      imageDimensions = await res.json();
    }
  } catch (err) {
    // silenced in production
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
