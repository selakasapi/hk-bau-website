const galleryConfigs = {
  "abbruch-referenzen": [{ prefix: "1.abbruch_", count: 19 }],
  "aussenanlagen-referenzen": [{ prefix: "1.aussenanlagen_", count: 19 }],
  "erdbau-referenzen": [
    { prefix: "1.erdbau_", count: 20 },
    { prefix: "2.erdbau_", count: 39 }
  ],
  "kanalbau-referenzen": [
    { prefix: "1.erdbau_", count: 17 },
    { prefix: "2.erdbau_", count: 51 }
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

function buildFileList(groups) {
  const files = [];
  groups.forEach(({ prefix, count }) => {
    for (let i = 1; i <= count; i++) {
      files.push(`${prefix}${i}.jpg`);
    }
  });
  return files;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".gallery[data-folder]").forEach(gallery => {
    const folder = gallery.dataset.folder;
    const config = galleryConfigs[folder];
    if (!config) return;
    const files = buildFileList(config);

    files.forEach((file, i) => {
      const num = i + 1;
      const link = document.createElement("a");
      link.href = `../images/${folder}/${file}`;
      link.className =
        "glightbox block overflow-hidden rounded-xl transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:z-10";
      link.setAttribute("data-aos", "zoom-in");
      link.setAttribute("data-aos-delay", `${(i + 1) * 50}`);
      link.setAttribute("aria-label", `${folder} Bild ${num}`);

      const img = document.createElement("img");
      img.src = `../images/${folder}/${file}`;
      img.alt = `${folder} ${num}`;
      img.loading = "lazy";
      img.className = "w-full h-auto";

      link.appendChild(img);
      gallery.appendChild(link);
    });
  });
});
