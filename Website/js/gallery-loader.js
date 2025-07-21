const galleryImages = [
  "1.erdbau_1.jpg",
  "1.erdbau_2.jpg",
  "1.erdbau_3.jpg",
  "1.erdbau_4.jpg",
  "1.erdbau_5.jpg",
  "1.erdbau_6.jpg",
  "1.erdbau_7.jpg",
  "1.erdbau_8.jpg",
  "1.erdbau_9.jpg",
  "1.erdbau_10.jpg",
  "1.erdbau_11.jpg",
  "1.erdbau_12.jpg",
  "1.erdbau_13.jpg",
  "1.erdbau_14.jpg",
  "1.erdbau_15.jpg",
  "1.erdbau_16.jpg",
  "1.erdbau_17.jpg",
  "1.erdbau_18.jpg",
  "1.erdbau_19.jpg",
  "1.erdbau_20.jpg",
  "2.erdbau_1.jpg",
  "2.erdbau_2.jpg",
  "2.erdbau_3.jpg",
  "2.erdbau_4.jpg",
  "2.erdbau_5.jpg",
  "2.erdbau_6.jpg",
  "2.erdbau_7.jpg",
  "2.erdbau_8.jpg",
  "2.erdbau_9.jpg",
  "2.erdbau_10.jpg",
  "2.erdbau_11.jpg",
  "2.erdbau_12.jpg",
  "2.erdbau_13.jpg",
  "2.erdbau_14.jpg",
  "2.erdbau_15.jpg",
  "2.erdbau_16.jpg",
  "2.erdbau_17.jpg",
  "2.erdbau_18.jpg",
  "2.erdbau_19.jpg",
  "2.erdbau_20.jpg",
  "2.erdbau_21.jpg",
  "2.erdbau_22.jpg",
  "2.erdbau_23.jpg",
  "2.erdbau_24.jpg",
  "2.erdbau_25.jpg",
  "2.erdbau_26.jpg",
  "2.erdbau_27.jpg",
  "2.erdbau_28.jpg",
  "2.erdbau_29.jpg",
  "2.erdbau_30.jpg",
  "2.erdbau_31.jpg",
  "2.erdbau_32.jpg",
  "2.erdbau_33.jpg",
  "2.erdbau_34.jpg",
  "2.erdbau_35.jpg",
  "2.erdbau_36.jpg",
  "2.erdbau_37.jpg",
  "2.erdbau_38.jpg",
  "2.erdbau_39.jpg",
  "2.erdbau_40.jpg",
  "2.erdbau_41.jpg",
  "2.erdbau_42.jpg",
  "2.erdbau_43.jpg",
  "2.erdbau_44.jpg",
  "2.erdbau_45.jpg",
  "2.erdbau_46.jpg",
  "2.erdbau_47.jpg",
  "2.erdbau_48.jpg",
  "2.erdbau_49.jpg",
  "2.erdbau_50.jpg",
  "2.erdbau_51.jpg"
];

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  galleryImages.forEach((file, i) => {
    const num = i + 1;
    const link = document.createElement("a");
    link.href = `../images/erdbau-referenzen/${file}`;
    link.className =
      "glightbox block overflow-hidden rounded-xl transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:z-10";
    link.setAttribute("data-aos", "zoom-in");
    link.setAttribute("data-aos-delay", `${(i + 1) * 50}`);
    link.setAttribute("aria-label", `Erdbau Projekt ${num}`);

    const img = document.createElement("img");
    img.src = `../images/erdbau-referenzen/${file}`;
    img.alt = `Erdbau ${num}`;
    img.loading = "lazy";
    img.className = "w-full h-auto";

    const caption = document.createElement("span");
    caption.className = "gallery-caption";
    caption.textContent = `Bild ${num}`;

    link.appendChild(img);
    link.appendChild(caption);
    gallery.appendChild(link);
  });
});
