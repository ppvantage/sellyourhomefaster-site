// /assets/js/cookie-consent.js
(function () {
  const KEY = 'syhf_cookie_consent_v1';
  const OLD_KEY = 'cookieConsent'; // migrate from this if present
  const isPolicyPage = window.location.pathname.includes('cookie-policy');

  function emitConsentUpdated() {
    const evt = new Event('cookieConsentUpdated');
    document.dispatchEvent(evt);
    window.dispatchEvent(evt);
  }

  function normalise(consent) {
    // Enforce a simple, stable shape
    return {
      analytics: !!consent.analytics,
      marketing: !!consent.marketing
    };
  }

  function setConsent(consent) {
    const clean = normalise(consent);
    localStorage.setItem(KEY, JSON.stringify(clean));
    window.cookieConsent = clean;
    document.getElementById('cookie-banner')?.remove();
    emitConsentUpdated();
  }

  function readConsentFromStorage() {
    // one-time migration from OLD_KEY
    const old = localStorage.getItem(OLD_KEY);
    const cur = localStorage.getItem(KEY);
    if (old && !cur) {
      localStorage.setItem(KEY, old);
      localStorage.removeItem(OLD_KEY);
    }
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || '{}');
      return normalise(parsed);
    } catch {
      return {};
    }
  }

  function showBanner() {
    if (isPolicyPage || document.getElementById('cookie-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.style.position = 'fixed';
    banner.style.bottom = '0';
    banner.style.left = '0';
    banner.style.right = '0';
    banner.style.background = '#fffbe6';
    banner.style.borderTop = '1px solid #ccc';
    banner.style.padding = '1em';
    banner.style.zIndex = '10000';
    banner.style.fontFamily = 'sans-serif';
    banner.innerHTML = `
      <div style="max-width:960px;margin:auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.75em;">
        <p style="margin:0;flex:1 1 420px;">We use cookies to run this site and embed a Google Form. Choose whether to allow analytics and marketing cookies.</p>
        <div style="display:flex;gap:.5em;flex-wrap:wrap;">
          <button id="acceptAllCookies" style="padding:.5em 1em;background:#29741d;color:#fff;border:0;border-radius:6px;cursor:pointer">Accept all</button>
          <button id="customCookies" style="padding:.5em 1em;background:#0b3d91;color:#fff;border:0;border-radius:6px;cursor:pointer">Set preferences</button>
          <button id="declineCookies" style="padding:.5em 1em;background:#6b7280;color:#fff;border:0;border-radius:6px;cursor:pointer">Decline</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('acceptAllCookies')?.addEventListener('click', () => {
      setConsent({ analytics: true, marketing: true });
    });
    document.getElementById('customCookies')?.addEventListener('click', () => {
      window.location.href = 'cookie-policy.html';
    });
    document.getElementById('declineCookies')?.addEventListener('click', () => {
      setConsent({ analytics: false, marketing: false });
    });
  }

  // Init
  (function init() {
    const saved = readConsentFromStorage();
    if (saved.analytics !== undefined || saved.marketing !== undefined) {
      window.cookieConsent = saved;
      emitConsentUpdated();
    } else {
      showBanner();
    }
  })();

  // No DOM toggling here — site-consent-loader.js handles UI based on consent.
})();
