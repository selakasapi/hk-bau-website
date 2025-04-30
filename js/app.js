document.addEventListener("DOMContentLoaded", () => {
  // === AOS animations ===
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  });

  // === Image fallback for all <img> ===
  const fallbackImage = "images/placeholder.jpg";
  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      img.onerror = null;
      img.src = fallbackImage;
    });
  });

  // === Mobile Menu Toggle ===
  const menuBtn = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const expanded = mobileMenu.classList.toggle("hidden");
      menuBtn.setAttribute("aria-expanded", !expanded);
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // === Scroll-to-top Button ===
  const scrollBtn = document.getElementById("scrollToTopBtn");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollBtn?.classList.remove("hidden");
    } else {
      scrollBtn?.classList.add("hidden");
    }
  });

  scrollBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // === Preloader ===
  const preloader = document.getElementById("preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
      preloader.style.transition = "opacity 0.5s ease";
    });
  }

  // === Contact Form Basic Validation ===
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      const email = document.getElementById("email").value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        event.preventDefault();
        alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      }

      // For demo mode – remove in production
      event.preventDefault();
      alert("Formular erfolgreich gesendet! (Demo-Modus)");
    });
  }
});
