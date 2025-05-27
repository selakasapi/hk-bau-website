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

function initStickyHeader(navbarId) {
    const navbar = document.getElementById(navbarId);
    if (!navbar) return;

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("sticky", window.scrollY > 50);
    });
}

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

        // Replace with real backend logic if needed
        console.log("Formular erfolgreich gesendet! (Demo-Modus)");
    });
}

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

function setupPageTransitions() {
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

// Init on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    AOS.init({ duration: 1000, once: true, offset: 100 });

    initMobileMenu("mobile-menu-button", "mobile-menu");
    initStickyHeader("navbar");
    initScrollToTop("scrollToTopBtn");
    initImageFallback();
    initFormValidation("contactForm");
    setActiveLink();
    setupPageTransitions();

    window.addEventListener("hashchange", setActiveLink);
});
