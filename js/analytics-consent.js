(function () {
  const GA_ID = "G-VK8HTW1N2L";
  const GTM_ID = "GTM-NT68K2ZT";
  const CONSENT_COOKIE = "cookieconsent_status";
  const ANALYTICS_COOKIES = ["_ga", "_gid", "_gat"];
  let analyticsLoaded = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });

  function loadScript(src) {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  function setAnalyticsConsent(granted) {
    window["ga-disable-" + GA_ID] = !granted;
    window.gtag("consent", "update", {
      ad_storage: "denied",
      analytics_storage: granted ? "granted" : "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
  }

  function expireCookie(name) {
    const expires = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
    const sameSite = "SameSite=Lax";
    document.cookie = `${name}=; ${expires}; path=/; ${sameSite}`;
    document.cookie = `${name}=; ${expires}; path=/; domain=.${window.location.hostname}; ${sameSite}`;
    const rootDomain = window.location.hostname.split(".").slice(-2).join(".");
    if (rootDomain && rootDomain !== window.location.hostname) {
      document.cookie = `${name}=; ${expires}; path=/; domain=.${rootDomain}; ${sameSite}`;
    }
  }

  function disableAnalytics() {
    setAnalyticsConsent(false);
    ANALYTICS_COOKIES.forEach(expireCookie);
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      if (name.startsWith("_ga_")) expireCookie(name);
    });
  }

  function enableAnalytics() {
    setAnalyticsConsent(true);
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    loadScript("https://www.googletagmanager.com/gtm.js?id=" + GTM_ID);
    loadScript("https://www.googletagmanager.com/gtag/js?id=" + GA_ID);

    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
  }

  function trackConsentAccept() {
    window.gtag("event", "cookie_consent_accept", {
      event_category: "cookie_consent",
      event_label: "analytics"
    });
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
        if (status === window.cookieconsent.status.allow) {
          enableAnalytics();
        } else {
          disableAnalytics();
        }
      },
      onStatusChange: function (status) {
        if (status === window.cookieconsent.status.allow) {
          enableAnalytics();
          trackConsentAccept();
        } else {
          disableAnalytics();
        }
      }
    });
  }

  window.addEventListener("load", initialiseBanner);
})();
