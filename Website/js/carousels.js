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

function initReferenzenCarousel() {
    const carousel = document.getElementById('referenzen-carousel');
    if (!carousel) return;

    const wasInitialized = carousel.dataset.initialized === 'true';

    if (!wasInitialized) {
        carousel.dataset.initialized = 'true';

        const track = carousel.querySelector('.flex');
        const slides = Array.from(track.children);
        slides.forEach(slide => track.appendChild(slide.cloneNode(true)));
        const images = track.querySelectorAll('img');
        images.forEach(img => img.setAttribute('loading', 'eager'));

        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');

        carousel._direction = 1;
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

        const attrSpeed = parseFloat(carousel.dataset.speed);
        const defaultSpeed = !isNaN(attrSpeed) && attrSpeed > 0 ? attrSpeed : 1.0;

        carousel._defaultSpeed = defaultSpeed;
        carousel._currentSpeed = defaultSpeed;

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
            if (!isDragging) {
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
                carousel._currentSpeed = carousel._defaultSpeed;
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

        startAutoScroll();
        startZoomLoop();
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

document.addEventListener('DOMContentLoaded', () => {
    initProjectCarousel();
    initServicesCarousel();
    initWirSchaffenCarousel();
    initReferenzenCarousel();

    document.querySelectorAll('.carousel-container').forEach(container => {
        let startX = 0;
        container.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
        });
        container.addEventListener('touchend', e => {
            const endX = e.changedTouches[0].clientX;
            const diff = endX - startX;
            if (diff > 50) container.querySelector('.carousel-prev')?.click();
            else if (diff < -50) container.querySelector('.carousel-next')?.click();
        });
    });
});

window.addEventListener('pageshow', (e) => {
    const carousel = document.getElementById('referenzen-carousel');
    if (carousel && (e.persisted || carousel.dataset.autoScrollActive !== 'true')) {
        initReferenzenCarousel();
    }
});
