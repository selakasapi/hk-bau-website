// ========== "Wir schaffen" Carousel (Autoplay, Swipe, Indicators) ============
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

    indicatorsContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-indicator-btn';
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
            dot.classList.toggle('active', i === currentIndex);
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

    window.addEventListener('resize', updateCarousel);

    updateCarousel();
    startAutoSlide();
}

// ========== Referenzen Marquee (auto-scroll, drag, wheel) ============
function initReferenzenCarousel() {
    const carousel = document.getElementById('referenzen-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.flex');
    if (!track) return;

    if (!carousel.dataset.cloned) {
        const slides = Array.from(track.children);
        slides.forEach(slide => track.appendChild(slide.cloneNode(true)));
        carousel.dataset.cloned = 'true';
    }

    let autoScrollId = null;
    let userInteracting = false;
    let resumeTimeout = null;
    const speed = 0.5;

    function autoScroll() {
        if (!userInteracting) {
            carousel.scrollLeft += speed;
            if (carousel.scrollLeft >= track.scrollWidth / 2) {
                carousel.scrollLeft = 0;
            }
        }
        autoScrollId = requestAnimationFrame(autoScroll);
    }

    function pauseAutoScroll() {
        userInteracting = true;
        clearTimeout(resumeTimeout);
    }

    function resumeAutoScrollAfterDelay() {
        clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
            userInteracting = false;
        }, 4000);
    }

    // Mouse drag
    let isDragging = false;
    let dragStartX = 0;
    let scrollStart = 0;
    /* True once the pointer has moved far enough to count as a scroll-drag
       rather than a tap. Used to suppress the click that would otherwise
       open the lightbox at the end of a drag. */
    var dragMoved = false;
    var DRAG_THRESHOLD = 6;

    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragMoved = false;
        dragStartX = e.pageX;
        scrollStart = carousel.scrollLeft;
        pauseAutoScroll();
        carousel.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        if (Math.abs(e.pageX - dragStartX) > DRAG_THRESHOLD) dragMoved = true;
        carousel.scrollLeft = scrollStart - (e.pageX - dragStartX);
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        carousel.style.cursor = 'grab';
        resumeAutoScrollAfterDelay();
    });

    // Touch — native scroll handles movement; we only track distance so a
    // swipe doesn't end up opening the lightbox.
    var touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
        dragMoved = false;
        touchStartX = e.touches[0].clientX;
        pauseAutoScroll();
    }, { passive: true });
    carousel.addEventListener('touchmove', (e) => {
        if (Math.abs(e.touches[0].clientX - touchStartX) > DRAG_THRESHOLD) dragMoved = true;
    }, { passive: true });
    carousel.addEventListener('touchend', resumeAutoScrollAfterDelay, { passive: true });

    // Suppress the click that follows a drag/swipe (capture phase, before
    // any lightbox click handler on the link runs).
    carousel.addEventListener('click', (e) => {
        if (dragMoved) {
            e.preventDefault();
            e.stopPropagation();
            dragMoved = false;
        }
    }, true);

    // Mouse wheel horizontal scroll
    carousel.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        e.preventDefault();
        carousel.scrollLeft += e.deltaY;
        pauseAutoScroll();
        resumeAutoScrollAfterDelay();
    }, { passive: false });

    autoScrollId = requestAnimationFrame(autoScroll);
}

document.addEventListener('DOMContentLoaded', () => {
    initWirSchaffenCarousel();
    initReferenzenCarousel();
});
