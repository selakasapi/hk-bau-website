// ========== Mobile Menu Toggle ============
function initMobileMenu(menuBtnId, mobileMenuId) {
    const menuBtn = document.getElementById(menuBtnId);
    const mobileMenu = document.getElementById(mobileMenuId);
    const backdrop = document.getElementById('nav-backdrop');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            const isHidden = mobileMenu.classList.toggle("translate-x-full");
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
    const fallbackImage = "../images/placeholder.png";
    document.querySelectorAll("img").forEach(img => {
        img.addEventListener("error", () => {
            img.onerror = null;
            img.src = fallbackImage;
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
  GLightbox({
    selector: '.glightbox',
    openEffect: 'zoom',
    closeEffect: 'fade',
    slideEffect: 'slide',
    touchNavigation: true,
    loop: true
  });
}


// ========== Contact Form Validation ============
function initFormValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = form.querySelector("#name").value.trim();
        const email = form.querySelector("#email").value.trim();
        const message = form.querySelector("#message").value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name.length < 2) return console.error("Name muss mindestens 2 Zeichen lang sein.");
        if (!emailRegex.test(email)) return console.error("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        if (message.length < 10) return console.error("Nachricht muss mindestens 10 Zeichen lang sein.");

    console.log("Formular erfolgreich gesendet! (Demo-Modus)");
    });
}

// ========== Contact Form Demo Handler ============
const baseMsgClass = "text-center mt-4 p-2 rounded transition-opacity duration-300";
function handleContactDemo(formId) {
    const form = document.getElementById(formId);
    const msg = document.getElementById('form-message');
    if (!form || !msg) return;

    async function fakeSend() {
        return new Promise(res => setTimeout(res, 500));
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await fakeSend(); // replace with real fetch()
            msg.textContent = 'Vielen Dank für Ihre Nachricht!';
            msg.className = 'text-green-700 bg-green-100 ' + baseMsgClass;
        } catch {
            msg.textContent = 'Fehler – bitte versuchen Sie es erneut.';
            msg.className = 'text-red-700 bg-red-100 ' + baseMsgClass;
        }
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

    document.querySelectorAll('a[href$=".html"]:not(.glightbox), a[href$=".html#"]:not(.glightbox), a[href^="./"]:not(.glightbox), a[href^="../"]:not(.glightbox)').forEach(link => {
        const currentUrl = new URL(window.location.href);
        const linkUrl = new URL(link.href);
        const isSameOrigin = linkUrl.origin === currentUrl.origin;
        const isSamePage = linkUrl.pathname === currentUrl.pathname;

        if (isSameOrigin && !isSamePage) {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                // Allow transition animation for all pages including the homepage

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
        dot.className = 'carousel-indicator-btn w-4 h-4 rounded-full bg-gray-300 hover:bg-[var(--primary-color)] transition-all duration-300';
        dot.setAttribute('aria-label', `Projekt ${i + 1}`);
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
            resetAutoSlide();
        });
        indicatorsContainer.appendChild(dot);
    });

    const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator-btn');

    function updateCarousel() {
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        indicators.forEach((dot, i) => {
            dot.classList.toggle('bg-[var(--primary-color)]', i === currentIndex);
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

// ========== Services Carousel ============

function initServicesCarousel() {
    const carouselWrapper = document.querySelector('.services-carousel .carousel-wrapper');
    const slides = document.querySelectorAll('.services-carousel .carousel-slide');
    const prevBtn = document.querySelector('.services-carousel .carousel-prev-btn');
    const nextBtn = document.querySelector('.services-carousel .carousel-next-btn');
    const indicatorsContainer = document.querySelector('.services-carousel .carousel-indicators');

    if (!carouselWrapper || slides.length === 0 || !prevBtn || !nextBtn || !indicatorsContainer) return;

    function getCardsPerView() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    let cardsPerView = getCardsPerView();
    let currentIndex = 0;
    let totalGroups = Math.ceil(slides.length / cardsPerView);
    let indicators = [];
    let autoSlideInterval;

    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < totalGroups; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-indicator-btn w-3 h-3 rounded-full bg-gray-300 mx-1';
            dot.setAttribute('aria-label', `Gruppe ${i + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
                resetAutoSlide();
            });
            indicatorsContainer.appendChild(dot);
        }
        indicators = indicatorsContainer.querySelectorAll('.carousel-indicator-btn');
    }

    function updateIndicators() {
        indicators.forEach((dot, i) => {
            dot.classList.toggle('bg-primary-color', i === currentIndex);
            dot.classList.toggle('bg-gray-300', i !== currentIndex);
        });
    }

    function updateCarousel() {
        const offset = currentIndex * cardsPerView * slides[0].offsetWidth;
        carouselWrapper.style.transform = `translateX(-${offset}px)`;
        updateIndicators();
    }

    function handleResize() {
        const newCardsPerView = getCardsPerView();
        if (newCardsPerView !== cardsPerView) {
            cardsPerView = newCardsPerView;
            totalGroups = Math.ceil(slides.length / cardsPerView);
            createIndicators();
            currentIndex = Math.min(currentIndex, totalGroups - 1);
            updateCarousel();
        } else {
            updateCarousel();
        }
    }

    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalGroups;
            updateCarousel();
        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalGroups) % totalGroups;
        updateCarousel();
        resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalGroups;
        updateCarousel();
        resetAutoSlide();
    });


    let startX = 0;
    carouselWrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carouselWrapper.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) {
            nextBtn.click();
        } else if (endX - startX > 50) {
            prevBtn.click();
        }
        resetAutoSlide();
    });

    createIndicators();
    updateCarousel();
    window.addEventListener('resize', handleResize);
    startAutoSlide();
}


function initWirSchaffenCarousel() {
    const carousel = document.querySelector('.wir-schaffen-carousel');
    if (!carousel) return;

    const wrapper = carousel.querySelector('.carousel-wrapper');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev-btn');
    const nextBtn = carousel.querySelector('.carousel-next-btn');
    const indicatorsContainer = carousel.querySelector('.carousel-indicators');

    if (!wrapper || slides.length === 0 || !prevBtn || !nextBtn || !indicatorsContainer) return;

    let currentIndex = 0;
    let autoSlideInterval;

    // Create indicators
    indicatorsContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-indicator-btn w-2.5 h-2.5 rounded-full bg-gray-300';
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
            resetAutoSlide();
        });
        indicatorsContainer.appendChild(dot);
    });

    const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator-btn');

    function updateCarousel() {
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        indicators.forEach((dot, i) => {
            dot.classList.toggle('bg-primary-color', i === currentIndex);
            dot.classList.toggle('bg-gray-300', i !== currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
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

    // Swipe support
    let touchStartX = 0;
    wrapper.addEventListener('touchstart', e => (touchStartX = e.touches[0].clientX));
    wrapper.addEventListener('touchend', e => {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        if (deltaX < -50) nextSlide();
        if (deltaX > 50) prevSlide();
        resetAutoSlide();
    });

    // Button handlers
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    window.addEventListener('resize', updateCarousel);

    updateCarousel();
    startAutoSlide();
}

// ========== DOMContentLoaded Bootstrap ============
document.addEventListener("DOMContentLoaded", () => {
  AOS.init({ once: true, duration: 800 });

  initMobileMenu("mobile-menu-button", "mobile-menu");
  initStickyHeader("navbar");
  initScrollToTop("scrollToTopBtn");
  initImageFallback();
  applyThemeColor();
  initLightbox();
  initFormValidation("contactForm");
  setActiveLink();
  setupPageTransitions();
  initProjectCarousel();
  initServicesCarousel();
  initWirSchaffenCarousel();
  initAnimatedCounters(); // ✅ Make sure this is the correct one
  initReferenzenCarousel();

  document.querySelectorAll('.carousel-container').forEach(container => {
    let startX = 0;
    container.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    });
    container.addEventListener('touchend', e => {
      let endX = e.changedTouches[0].clientX;
      let diff = endX - startX;
      if (diff > 50) container.querySelector('.carousel-prev')?.click();
      else if (diff < -50) container.querySelector('.carousel-next')?.click();
    });
  });

  window.addEventListener("hashchange", setActiveLink);

  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const overlay = document.querySelector(".page-transition-overlay");
  if (overlay) {
    const links = document.querySelectorAll("a[href]:not(.glightbox)");
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
        requestAnimationFrame(() => {
          overlay.classList.add("is-fading-in");
          setTimeout(() => {
            window.location.href = href;
          }, 500);
        });
      });
    });
  }
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

// Initialize the scrolling references carousel
function initReferenzenCarousel() {
  const carousel = document.getElementById('referenzen-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.flex');
  const images = track.querySelectorAll('img');

  let scrollAmount = 0;
  let isDragging = false;
  let startX = 0;
  let startScroll = 0;
  const defaultSpeed = 1; // pixels per frame
  let currentSpeed = defaultSpeed;

  function slowDown() {
    if (currentSpeed > 0) {
      currentSpeed -= defaultSpeed / 20;
      if (currentSpeed < 0) currentSpeed = 0;
      requestAnimationFrame(slowDown);
    }
  }

  function speedUp() {
    if (currentSpeed < defaultSpeed) {
      currentSpeed += defaultSpeed / 20;
      if (currentSpeed > defaultSpeed) currentSpeed = defaultSpeed;
      requestAnimationFrame(speedUp);
    }
  }

  carousel.addEventListener('mouseenter', slowDown);
  carousel.addEventListener('mouseleave', speedUp);

  carousel.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    startScroll = carousel.scrollLeft;
  });

  carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const deltaX = startX - e.touches[0].clientX;
    carousel.scrollLeft = startScroll + deltaX;
  });

  carousel.addEventListener('touchend', () => {
    isDragging = false;
    scrollAmount = carousel.scrollLeft;
  });

  function autoScroll() {
    if (!isDragging) {
      scrollAmount += currentSpeed;
      if (scrollAmount >= track.scrollWidth - carousel.clientWidth) {
        scrollAmount = 0;
      }
      carousel.scrollLeft = scrollAmount;
    }
    requestAnimationFrame(autoScroll);
  }

  requestAnimationFrame(autoScroll);

  function updateCenterZoom() {
    const carouselRect = carousel.getBoundingClientRect();
    const centerX = carouselRect.left + carouselRect.width / 2;
    let closestImg = null;
    let closestDistance = Infinity;
    images.forEach(img => {
      const imgRect = img.getBoundingClientRect();
      const imgCenter = imgRect.left + imgRect.width / 2;
      const distance = Math.abs(centerX - imgCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestImg = img;
      }
    });
    images.forEach(img => img.classList.remove('center-zoom'));
    if (closestImg) closestImg.classList.add('center-zoom');
  }

  setInterval(updateCenterZoom, 300);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const img = entry.target.querySelector('img');
      if (entry.isIntersecting) {
        img.classList.add('scale-110');
      } else {
        img.classList.remove('scale-110');
      }
    });
  }, {
    root: carousel,
    threshold: 0.6
  });

  carousel.querySelectorAll('.snap-center').forEach(el => {
    observer.observe(el);
  });
}


