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

document.addEventListener("DOMContentLoaded", () => {
  initFormValidation("contactForm");
});






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
        if (sessionStorage.getItem('isTransitioning') !== 'true' || e.persisted) {
            overlay.classList.remove('is-fading-in', 'is-fading-out');
            Object.assign(overlay.style, {
                opacity: '0',
                visibility: 'hidden',
                pointerEvents: 'none'
            });
            document.documentElement.classList.remove('is-transitioning');
        }
    });

    window.addEventListener('pagehide', (e) => {
        if (sessionStorage.getItem('isTransitioning') !== 'true' || e.persisted) {
            overlay.classList.remove('is-fading-in', 'is-fading-out');
            Object.assign(overlay.style, {
                opacity: '0',
                visibility: 'hidden',
                pointerEvents: 'none'
            });
            document.documentElement.classList.remove('is-transitioning');
        }
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
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  if (window.AOS) {
    AOS.init({ once: true, duration: 800 });
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
  initProjectCarousel();
  initServicesCarousel();
  initWirSchaffenCarousel();
  initAnimatedCounters();
  initReferenzenCarousel();
  loadHeroVideo();

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

});

window.addEventListener('pageshow', (e) => {
  const carousel = document.getElementById('referenzen-carousel');
  if (carousel && (e.persisted || carousel.dataset.autoScrollActive !== 'true')) {
    initReferenzenCarousel();
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

    const wasInitialized = carousel.dataset.initialized === 'true';

    // Initial setup only once
    if (!wasInitialized) {
      carousel.dataset.initialized = 'true';

      const track = carousel.querySelector('.flex');
      const slides = Array.from(track.children);
      slides.forEach(slide => track.appendChild(slide.cloneNode(true)));
      const images = track.querySelectorAll('img');
      images.forEach(img => img.setAttribute('loading', 'eager'));

    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    // Direction control for continuous scrolling
    carousel._direction = 1; // 1 = forward (next), -1 = backward (previous)

    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const slideWidth = slides[0].offsetWidth + gap;

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    carousel._direction = -1;
    carousel.scrollLeft -= slideWidth;
    if (carousel.scrollLeft < 0) {
      carousel.scrollLeft += track.scrollWidth / 2;
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    carousel._direction = 1;
    carousel.scrollLeft += slideWidth;
    if (carousel.scrollLeft >= track.scrollWidth / 2) {
      carousel.scrollLeft -= track.scrollWidth / 2;
    }
  });
}

    let isDragging = false;
    let startX = 0;
    let startScroll = 0;
    carousel._isHovered = false;

    // Determine default scrolling speed from data attribute
    // Example: <div id="referenzen-carousel" data-speed="1.5">
    const attrSpeed = parseFloat(carousel.dataset.speed);
    const defaultSpeed = !isNaN(attrSpeed) && attrSpeed > 0 ? attrSpeed : 1.0; // pixels per frame

    carousel._defaultSpeed = defaultSpeed;
    carousel._currentSpeed = defaultSpeed;

    function slowDown() {
      if (carousel._currentSpeed > 0) {
        carousel._currentSpeed -= carousel._defaultSpeed / 20;
        if (carousel._currentSpeed < 0) carousel._currentSpeed = 0;
        requestAnimationFrame(slowDown);
      }
    }

    function speedUp() {
      if (carousel._currentSpeed < carousel._defaultSpeed) {
        carousel._currentSpeed += carousel._defaultSpeed / 20;
        if (carousel._currentSpeed > carousel._defaultSpeed) carousel._currentSpeed = carousel._defaultSpeed;
        requestAnimationFrame(speedUp);
      }
    }

    carousel.addEventListener('mouseenter', () => {
      carousel._isHovered = true;
      slowDown();
    });

    carousel.addEventListener('mouseleave', () => {
      carousel._isHovered = false;
      speedUp();
    });

    carousel.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      startScroll = carousel.scrollLeft;
    });

    function onMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      const deltaX = startX - e.touches[0].clientX;
      carousel.scrollLeft = startScroll + deltaX;
    }

    carousel.addEventListener('touchmove', onMove, { passive: false });

    carousel.addEventListener('touchend', () => {
      isDragging = false;
    });

    carousel._autoScrollId = null;

    function autoScrollStep() {
      if (!carousel._isHovered && !isDragging) {
        carousel.scrollLeft += carousel._currentSpeed * carousel._direction;
        if (carousel.scrollLeft >= track.scrollWidth / 2) {
          carousel.scrollLeft -= track.scrollWidth / 2;
        }
        if (carousel.scrollLeft <= 0) {
          carousel.scrollLeft += track.scrollWidth / 2;
        }
      }
      carousel._autoScrollId = requestAnimationFrame(autoScrollStep);
    }

    function startAutoScroll() {
      if (carousel._autoScrollId === null) {
        carousel._currentSpeed = carousel._defaultSpeed; // ensure speed resumes
        carousel._autoScrollId = requestAnimationFrame(autoScrollStep);
        carousel.dataset.autoScrollActive = 'true';
      }
    }

    function stopAutoScroll() {
      if (carousel._autoScrollId !== null) {
        cancelAnimationFrame(carousel._autoScrollId);
        carousel._autoScrollId = null;
        carousel.dataset.autoScrollActive = 'false';
      }
    }


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

    carousel._zoomRafId = null;

    function zoomLoop() {
      updateCenterZoom();
      carousel._zoomRafId = requestAnimationFrame(zoomLoop);
    }

    function startZoomLoop() {
      if (carousel._zoomRafId === null) {
        zoomLoop();
      }
    }

    function stopZoomLoop() {
      if (carousel._zoomRafId !== null) {
        cancelAnimationFrame(carousel._zoomRafId);
        carousel._zoomRafId = null;
      }
    }

    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startZoomLoop();
          startAutoScroll();
        } else {
          stopZoomLoop();
          stopAutoScroll();
        }
      });
    }, { threshold: 0 });

    visibilityObserver.observe(carousel);

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

    carousel.startAutoScroll = startAutoScroll;
    carousel.stopAutoScroll = stopAutoScroll;
    carousel.startZoomLoop = startZoomLoop;
    carousel.stopZoomLoop = stopZoomLoop;
  }

  if (wasInitialized) {
    if (carousel.startAutoScroll && carousel.dataset.autoScrollActive !== 'true') {
      carousel.startAutoScroll();
    }
    if (carousel.startZoomLoop && carousel._zoomRafId === null) {
      carousel.startZoomLoop();
    }
  }
  }

