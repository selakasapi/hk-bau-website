function initMobileMenu(menuBtnId, mobileMenuId) {
  const menuBtn = document.getElementById(menuBtnId);
  const mobileMenu = document.getElementById(mobileMenuId);
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      menuBtn.setAttribute("aria-expanded", !mobileMenu.classList.contains("hidden"));
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });

    // Keyboard navigation for mobile menu
    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          link.click();
        }
      });
    });
  }
}

function initStickyHeader(navbarId) {
  const navbar = document.getElementById(navbarId);
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("sticky");
      } else {
        navbar.classList.remove("sticky");
      }
    });
  }
}

function initScrollToTop(btnId) {
  const scrollBtn = document.getElementById(btnId);
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      scrollBtn.classList.toggle("hidden", window.scrollY <= 300);
    });

    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function initImageFallback() {
  const fallbackImage = "../images/placeholder.png";
  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      img.onerror = null;
      img.src = fallbackImage;
    });
  });
}

function initFormValidation(formId) {
  const contactForm = document.getElementById(formId);
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (name.length < 2) {
        alert("Name muss mindestens 2 Zeichen lang sein.");
        return;
      }
      if (!emailRegex.test(email)) {
        alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        return;
      }
      if (message.length < 10) {
        alert("Nachricht muss mindestens 10 Zeichen lang sein.");
        return;
      }

      // Replace with actual backend submission (e.g., fetch to API)
      // Example:
      /*
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      })
      .then(response => response.json())
      .then(data => alert("Nachricht gesendet!"))
      .catch(error => alert("Fehler beim Senden."));
      */
      alert("Formular erfolgreich gesendet! (Demo-Modus)");
    });
  }
}

function setActiveLink() {
  const currentPath = window.location.pathname;
  document.querySelectorAll("nav a").forEach(link => {
    const href = link.getAttribute("href");
    if (currentPath.includes(href) || (href === "../index.html" && currentPath === "/")) {
      link.classList.add("active-link");
    } else {
      link.classList.remove("active-link");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS
  AOS.init({ duration: 1000, once: true, offset: 100 });

  // Initialize shared functionality
  initMobileMenu("mobile-menu-button", "mobile-menu");
  initStickyHeader("navbar");
  initScrollToTop("scrollToTopBtn");
  initImageFallback();
  initFormValidation("contactForm");
  setActiveLink();
});


