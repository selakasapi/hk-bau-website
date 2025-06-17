// ========== Mobile Menu Toggle ============
function initMobileMenu(menuBtnId, mobileMenuId) {
    const menuBtn = document.getElementById(menuBtnId);
    const mobileMenu = document.getElementById(mobileMenuId);

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
            menuBtn.setAttribute("aria-expanded", !mobileMenu.classList.contains("hidden"));
        });

        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.add("hidden");
                menuBtn.setAttribute("aria-expanded", "false");
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
        navbar.classList.add("bg-[#1f1f1f]");
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
    const fallbackImage = "../images/placeholder.png";
    document.querySelectorAll("img").forEach(img => {
        img.addEventListener("error", () => {
            img.onerror = null;
            img.src = fallbackImage;
        });
    });
}

// ========== Contact Form Validation ============
function initFormValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(input, message) {
        let errorEl = input.nextElementSibling;
        if (!errorEl || !errorEl.classList.contains("error-message")) {
            errorEl = document.createElement("div");
            errorEl.className = "error-message";
            input.after(errorEl);
        }
        errorEl.textContent = message;
        errorEl.classList.add("visible");
    }

    function clearError(input) {
        const errorEl = input.nextElementSibling;
        if (errorEl && errorEl.classList.contains("error-message")) {
            errorEl.textContent = "";
            errorEl.classList.remove("visible");
        }
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const nameInput = form.querySelector("#name");
        const emailInput = form.querySelector("#email");
        const messageInput = form.querySelector("#message");

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        let hasError = false;

        if (name.length < 2) {
            showError(nameInput, "Name muss mindestens 2 Zeichen lang sein.");
            hasError = true;
        } else {
            clearError(nameInput);
        }

        if (!emailRegex.test(email)) {
            showError(emailInput, "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
            hasError = true;
        } else {
            clearError(emailInput);
        }

        if (message.length < 10) {
            showError(messageInput, "Nachricht muss mindestens 10 Zeichen lang sein.");
            hasError = true;
        } else {
            clearError(messageInput);
        }

        if (hasError) return;

        console.log("Formular erfolgreich gesendet! (Demo-Modus)");
        form.reset();
    });

    ["#name", "#email", "#message"].forEach(selector => {
        const input = form.querySelector(selector);
        input.addEventListener("input", () => {
            if (input.nextElementSibling && input.nextElementSibling.classList.contains("error-message")) {
                if (selector === "#email" ? emailRegex.test(input.value.trim()) : input.value.trim().length >= (selector === "#message" ? 10 : 2)) {
                    clearError(input);
                }
            }
        });
    });
}

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
    let overlay = document.getElementById("pageTransitionOverlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "pageTransitionOverlay";
        overlay.classList.add("page-transition-overlay");
        document.body.appendChild(overlay);
    }

    if (sessionStorage.getItem("isTransitioning") === "true") {
        overlay.classList.remove("is-wiping-in");
        overlay.classList.add("is-wiping-out");

        overlay.addEventListener("animationend", function handler() {
            overlay.classList.remove("is-wiping-out");
            Object.assign(overlay.style, {
                opacity: "0",
                visibility: "hidden",
                pointerEvents: "none"
            });
            sessionStorage.removeItem("isTransitioning");
            overlay.removeEventListener("animationend", handler);
        }, { once: true });
    } else {
        Object.assign(overlay.style, {
            opacity: "0",
            visibility: "hidden",
            pointerEvents: "none"
        });
    }

    document.querySelectorAll('a[href$=".html"], a[href$=".html#"], a[href^="./"], a[href^="../"]').forEach(link => {
        const currentUrl = new URL(window.location.href);
        const linkUrl = new URL(link.href);
        const isSameOrigin = linkUrl.origin === currentUrl.origin;
        const isSamePage = linkUrl.pathname === currentUrl.pathname;
        const isHomePage = linkUrl.pathname === "/" || linkUrl.pathname.endsWith("/index.html");

        if (isSameOrigin && !isSamePage) {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                if (isHomePage) {
                    window.location.href = linkUrl.href;
                    return;
                }

                Object.assign(overlay.style, {
                    opacity: "1",
                    visibility: "visible",
                    pointerEvents: "auto"
                });
                overlay.classList.remove("is-wiping-out");
                overlay.classList.add("is-wiping-in");

                sessionStorage.setItem("isTransitioning", "true");
                setTimeout(() => {
                    window.location.href = linkUrl.href;
                }, 500);
            });
        }
    });
}

// ========== Hero Section Parallax Background ============
function initParallaxHero() {
    const bg = document.getElementById('parallax-bg');
    if (!bg) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        bg.style.transform = `translateY(${scrollY * 0.4}px)`;
    });
}

// ========== Project Carousel (Autoplay, Swipe, Indicators) ============
function initProjectCarousel() {
    const wrapper = document.querySelector('.project-carousel .carousel-wrapper');
    const slides = document.querySelectorAll('.project-carousel .carousel-slide');
    const prevBtn = document.querySelector('.project-carousel .carousel-prev-btn');
    const nextBtn = document.querySelector('.project-carousel .carousel-next-btn');
    const indicatorsContainer = document.querySelector('.project-carousel .carousel-indicators');

    if (!wrapper || slides.length === 0 || !prevBtn || !nextBtn || !indicatorsContainer) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;

    indicatorsContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-indicator-btn w-4 h-4 rounded-full bg-gray-300 hover:bg-[#fbb03b] transition-all duration-300';
        dot.setAttribute('aria-label', `Projekt ${i + 1}`);
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
            resetAutoSlide();
        });
        indicatorsContainer.appendChild(dot);
    });

    const indicators = document.querySelectorAll('.carousel-indicator-btn');

    function updateCarousel() {
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        indicators.forEach((dot, i) => {
            dot.classList.toggle('bg-[#fbb03b]', i === currentIndex);
            dot.classList.toggle('bg-gray-300', i !== currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    let touchStartX = 0;
    wrapper.addEventListener('touchstart', e => (touchStartX = e.touches[0].clientX));
    wrapper.addEventListener('touchend', e => {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        if (deltaX < -50) nextSlide();
        if (deltaX > 50) prevSlide();
        resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    updateCarousel();
    startAutoSlide();
}

// ========== DOMContentLoaded Bootstrap ============
document.addEventListener("DOMContentLoaded", () => {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });

    initMobileMenu("mobile-menu-button", "mobile-menu");
    initStickyHeader("navbar");
    initScrollToTop("scrollToTopBtn");
    initImageFallback();
    initFormValidation("contactForm");
    setActiveLink();
    setupPageTransitions();
    initProjectCarousel();
    initParallaxHero();

    window.addEventListener("hashchange", setActiveLink);

    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    const overlay = document.querySelector(".page-transition-overlay");
    if (overlay) {
        const links = document.querySelectorAll("a[href]");
        links.forEach(link => {
            const href = link.getAttribute("href");
            if (
                !href ||
                href.startsWith("http") ||
                href.startsWith("mailto:") ||
                href.startsWith("#") ||
                href.endsWith(".pdf")
            ) return;

            link.addEventListener("click", (e) => {
                e.preventDefault();

                // Trigger fade with requestAnimationFrame
                requestAnimationFrame(() => {
                    overlay.classList.add("is-fading-in");

                    // Delay nav just enough to let transition visibly begin
                    setTimeout(() => {
                        window.location.href = href;
                    }, 500); // Match CSS transition duration
                });
            });
        });
    }
});


function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectItems = document.querySelectorAll(".project-item");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const selected = button.getAttribute("data-filter");

      // Show/hide items
      let anyVisible = false;
      projectItems.forEach(item => {
        const category = item.getAttribute("data-category");
        const shouldShow = selected === "all" || category === selected;
        item.classList.toggle("hidden", !shouldShow);
        if (shouldShow) anyVisible = true;
      });

      // Update active button styling
      filterButtons.forEach(btn =>
        btn.classList.remove("bg-[#fbb03b]", "text-white", "ring", "ring-offset-2", "ring-[#fbb03b]")
      );
      button.classList.add("bg-[#fbb03b]", "text-white", "ring", "ring-offset-2", "ring-[#fbb03b]");
    });

    // Optional: keyboard accessibility
    button.addEventListener("keydown", (e) => {
      if (["Enter", " "].includes(e.key)) {
        e.preventDefault();
        button.click();
      }
    });
  });
}

window.addEventListener("load", () => {
  const overlay = document.querySelector(".page-transition-overlay");
  if (overlay) {
    overlay.classList.remove("is-fading-in");
    overlay.classList.add("is-fading-out");

    setTimeout(() => {
      overlay.classList.remove("is-fading-out");
    }, 500);
  }
});
