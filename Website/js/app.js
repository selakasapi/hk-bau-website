// ========== Mobile Menu Toggle ============
function initMobileMenu(menuBtnId, mobileMenuId) {
    const menuBtn = document.getElementById(menuBtnId);
    const mobileMenu = document.getElementById(mobileMenuId);
    const backdrop = document.getElementById('nav-backdrop');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            const isHidden = mobileMenu.classList.toggle("hidden");
            menuBtn.setAttribute("aria-expanded", !isHidden);
            if (backdrop) backdrop.classList.toggle('hidden', isHidden);
        });

        if (backdrop) {
            backdrop.addEventListener('click', () => {
                mobileMenu.classList.add('translate-x-full');
                menuBtn.setAttribute('aria-expanded', 'false');
                backdrop.classList.add('hidden');
            });
        }

        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.add("translate-x-full");
                menuBtn.setAttribute("aria-expanded", "false");
                if (backdrop) backdrop.classList.add('hidden');
            });

            link.addEventListener("keydown", (e) => {
                if (["Enter", " "].includes(e.key)) {
                    e.preventDefault();
                    link.click();
                }
            });
        });
    }
}


// ========== Sticky Navbar Scroll Effect ============
function initStickyHeader(navbarId) {
    const navbar = document.getElementById(navbarId);
    if (!navbar) return;

    const isImpressum = document.body.classList.contains("impressum-page");
    if (isImpressum) {
        navbar.style.backgroundColor = "var(--secondary-color)";
        return;
    }

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("sticky", window.scrollY > 50);
    });
}

// ========== Scroll To Top Button ============
function initScrollToTop(btnId) {
    const scrollBtn = document.getElementById(btnId);
    if (!scrollBtn) return;

    window.addEventListener("scroll", () => {
        scrollBtn.classList.toggle("hidden", window.scrollY <= 300);
    });

    scrollBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ========== Image Fallback for Broken Images ============
function initImageFallback() {
    document.querySelectorAll("img").forEach(img => {
        img.addEventListener("error", () => {
            img.onerror = null;
            img.style.display = "none";
        });
    });
}

// ======== Apply Theme Color from CSS Variable ============
function applyThemeColor() {
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color').trim();
  document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
    meta.setAttribute('content', primaryColor);
  });
}

// ======== GLightbox Initialization ============
function initLightbox() {
  if (typeof window.GLightbox !== 'function') return;

  if (window._glightboxInstance) {
    window._glightboxInstance.reload();
    return;
  }

  window._glightboxInstance = GLightbox({
    selector: '.glightbox',
    openEffect: 'zoom',
    closeEffect: 'fade',
    slideEffect: 'slide',
    touchNavigation: true,
    loop: true
  });
}


// ========== Contact Form Validation with Animation ============

function showMessage(msgElement, text, isSuccess = true) {
  msgElement.textContent = text;
  msgElement.classList.remove("hidden", "opacity-0", "text-red-600", "text-green-600");
  msgElement.classList.add("opacity-100", isSuccess ? "text-green-600" : "text-red-600");

  // Auto-hide after 5 seconds
  setTimeout(() => {
    msgElement.classList.remove("opacity-100");
    msgElement.classList.add("opacity-0");
    setTimeout(() => {
      msgElement.classList.add("hidden");
    }, 500); // wait for fade-out to complete
  }, 5000);
}

function initFormValidation(formId) {
  const form = document.getElementById(formId);
  const msg = document.getElementById("form-message");
  if (!form || !msg) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const phone = form.querySelector("#phone").value.trim();
    const message = form.querySelector("#message").value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Basic validation
    if (name.length < 2 || !emailRegex.test(email) || message.length < 10) {
      showMessage(msg, "Bitte füllen Sie das Formular korrekt aus.", false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("message", message);
    formData.append("_subject", "Neue Nachricht über Kontaktformular");

    try {
      const response = await fetch("https://formspree.io/f/xblklllg", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: formData,
      });

      if (response.ok) {
        form.reset();
        showMessage(msg, "Vielen Dank für Ihre Nachricht. Wir melden uns schnellstmöglich bei Ihnen.", true);
      } else {
        showMessage(msg, "Es gab ein Problem beim Senden. Bitte versuchen Sie es erneut.", false);
      }
    } catch (error) {
      showMessage(msg, "Netzwerkfehler. Bitte später erneut versuchen.", false);
      console.error(error);
    }
  });
}

// Former standalone DOMContentLoaded listener removed. Form validation is
// initialized within the main DOMContentLoaded bootstrap below.

// ========== Highlight Active Navigation Links ============
function markActiveLinks(containerSelector, currentPath) {
    document.querySelectorAll(`${containerSelector} a`).forEach(link => {
        const href = link.getAttribute("href");
        const isActive =
            (currentPath === "index.html" && href === "index.html") ||
            (currentPath === "" && href === "index.html") ||
            (href.includes(currentPath) && currentPath !== "index.html");

        link.classList.toggle("active-link", isActive);
    });
}

function setActiveLink() {
    const currentPath = window.location.pathname.split("/").pop();
    markActiveLinks("header nav", currentPath);
    markActiveLinks("#mobile-menu", currentPath);
}

// ========== Page Transitions with Overlay ============
function setupPageTransitions() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return; // Skip transitions for reduced motion users
    }
    let overlay = document.querySelector('#pageTransitionOverlay, .page-transition-overlay');
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "pageTransitionOverlay";
        overlay.classList.add("page-transition-overlay");
        document.body.appendChild(overlay);
    }

    window.addEventListener('pageshow', (e) => {
        if (e.persisted || sessionStorage.getItem('isTransitioning') === 'true') {
            sessionStorage.removeItem('isTransitioning');
        }

        overlay.classList.remove('is-fading-in', 'is-fading-out');
        Object.assign(overlay.style, {
            opacity: '0',
            visibility: 'hidden',
            pointerEvents: 'none'
        });
        document.documentElement.classList.remove('is-transitioning');
    });

    window.addEventListener('pagehide', () => {
        sessionStorage.removeItem('isTransitioning');
        overlay.classList.remove('is-fading-in', 'is-fading-out');
        Object.assign(overlay.style, {
            opacity: '0',
            visibility: 'hidden',
            pointerEvents: 'none'
        });
        document.documentElement.classList.remove('is-transitioning');
    });

    if (sessionStorage.getItem("isTransitioning") === "true") {
        Object.assign(overlay.style, {
            opacity: "1",
            visibility: "visible",
            pointerEvents: "auto"
        });
        if (!document.documentElement.classList.contains("is-transitioning")) {
            overlay.classList.add("is-fading-in");
        }

        const heroMedia = document.querySelector('[data-hero-media]');

        let overlayHidden = false;
        let overlayTimeout;
        const hideOverlay = () => {
            if (overlayHidden) return;
            overlayHidden = true;
            clearTimeout(overlayTimeout);
            overlay.classList.remove("is-fading-in");
            overlay.classList.add("is-fading-out");

            overlay.addEventListener("transitionend", function handler() {
                overlay.classList.remove("is-fading-out");
                Object.assign(overlay.style, {
                    opacity: "0",
                    visibility: "hidden",
                    pointerEvents: "none"
                });
                sessionStorage.removeItem("isTransitioning");
                document.documentElement.classList.remove("is-transitioning");
                overlay.removeEventListener("transitionend", handler);
            }, { once: true });
        };

        overlayTimeout = setTimeout(hideOverlay, 3000);
        hideOverlay();

        if (heroMedia) {
            if (heroMedia.tagName === 'VIDEO') {
                const posterSrc = heroMedia.getAttribute('poster');
                if (posterSrc) {
                    const posterImg = new Image();
                    posterImg.src = posterSrc;
                    if (posterImg.complete) hideOverlay();
                    else posterImg.addEventListener('load', hideOverlay, { once: true });
                }

                if (heroMedia.readyState >= 3) {
                    hideOverlay();
                } else {
                    heroMedia.addEventListener('loadeddata', hideOverlay, { once: true });
                }
            } else {
                if (heroMedia.complete) hideOverlay();
                else heroMedia.addEventListener('load', hideOverlay, { once: true });
            }
        } else {
            hideOverlay();
        }
    } else {
        Object.assign(overlay.style, {
            opacity: "0",
            visibility: "hidden",
            pointerEvents: "none"
        });
    }

    document.querySelectorAll('a[href$=".html"]:not(.glightbox), a[href$=".html#"]:not(.glightbox), a[href^="./"]:not(.glightbox), a[href^="../"]:not(.glightbox)').forEach(link => {
        const currentUrl = new URL(window.location.href);
        const linkUrl = new URL(link.href);
        const isSameOrigin = linkUrl.origin === currentUrl.origin;
        const isSamePage = linkUrl.pathname === currentUrl.pathname;

        if (isSameOrigin && !isSamePage) {
            link.addEventListener("click", (e) => {
                e.preventDefault();

                if (sessionStorage.getItem("isTransitioning") === "true") return;

                Object.assign(overlay.style, {
                    opacity: "1",
                    visibility: "visible",
                    pointerEvents: "auto"
                });
                overlay.classList.remove("is-fading-out");
                overlay.classList.add("is-fading-in");

                sessionStorage.setItem("isTransitioning", "true");
                setTimeout(() => {
                    window.location.href = linkUrl.href;
                }, 500);
            });
        }
    });
}

// ======== Delayed Hero Video Load ===========
function loadHeroVideo() {
    const video = document.querySelector('[data-hero-media][data-load-after]');
    if (video) {
        video.load();
    }
}

// ========== DOMContentLoaded Bootstrap ============
document.addEventListener("DOMContentLoaded", () => {
  const navEntry = performance.getEntriesByType('navigation')[0];
  const isBackForward = navEntry && navEntry.type === 'back_forward';

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = isBackForward ? "auto" : "manual";
  }
  if (!isBackForward) {
    window.scrollTo(0, 0);
  }

  if (window.AOS) {
    AOS.init({ once: true, duration: 400, easing: 'ease-out' });
  }

  initMobileMenu("mobile-menu-button", "mobile-menu");
  initStickyHeader("navbar");
  initScrollToTop("scrollToTopBtn");
  initImageFallback();
  applyThemeColor();
  initLightbox();
  initFormValidation("contactForm");
  setActiveLink();
  setupPageTransitions();
  initAnimatedCounters();
  loadHeroVideo();

  window.addEventListener("hashchange", setActiveLink);

  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

});

// Animate counters when the section scrolls into view
function initAnimatedCounters() {
  const section = document.querySelector('.counter-section');
  const counters = document.querySelectorAll('.counter');
  if (!section || counters.length === 0) return;

  const animate = (counter) => {
    const target = parseInt(counter.dataset.target, 10);
    const duration = 2000;
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      counter.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      counters.forEach(animate);
      observer.disconnect();
    }
  }, { threshold: 0.4 });

  observer.observe(section);
}



