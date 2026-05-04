(function () {
  const GA_ID = "G-VK8HTW1N2L";
  const GTM_ID = "GTM-NT68K2ZT";
  const CONSENT_COOKIE = "cookieconsent_status";
  let analyticsLoaded = false;

  function loadScript(src) {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  function enableAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    loadScript("https://www.googletagmanager.com/gtm.js?id=" + GTM_ID);
    loadScript("https://www.googletagmanager.com/gtag/js?id=" + GA_ID);

    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
  }

  function hasStoredConsent() {
    return document.cookie.split(";").some((cookie) => {
      return cookie.trim() === CONSENT_COOKIE + "=allow";
    });
  }

  function initialiseBanner() {
    const privacyUrl = window.location.pathname.includes("/Referenzen/")
      ? "../datenschutzerklaerung.html"
      : "datenschutzerklaerung.html";

    if (!window.cookieconsent) {
      if (hasStoredConsent()) enableAnalytics();
      return;
    }

    window.cookieconsent.initialise({
      type: "opt-in",
      revokable: true,
      palette: {
        popup: { background: "#2b2b2b" },
        button: { background: "#fbbb21", text: "#111111" }
      },
      theme: "classic",
      content: {
        message: "Diese Website verwendet optionale Analyse-Cookies nur mit Ihrer Zustimmung.",
        allow: "Akzeptieren",
        deny: "Ablehnen",
        link: "Mehr erfahren",
        href: privacyUrl
      },
      onInitialise: function (status) {
        if (status === window.cookieconsent.status.allow) enableAnalytics();
      },
      onStatusChange: function (status) {
        if (status === window.cookieconsent.status.allow) enableAnalytics();
      }
    });
  }

  window.addEventListener("load", initialiseBanner);
})();
