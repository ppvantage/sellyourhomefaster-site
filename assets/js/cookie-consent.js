// cookie-consent.js
(function () {
  const KEY = 'syhf_cookie_consent_v1';       // <- versioned key
  const OLD_KEY = 'cookieConsent';            // <- migrate from this if present
  const isPolicyPage = window.location.pathname.includes('cookie-policy');

  function emitConsentUpdated() {
    const evt = new Event('cookieConsentUpdated');
    document.dispatchEvent(evt);
    window.dispatchEvent(evt);
  }

  function setConsent(consent) {
    localStorage.setItem(KEY, JSON.stringify(consent));
    window.cookieConsent = consent;
    document.getElementById('cookie-banner')?.remove();
    emitConsentUpdated();
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
      <div style="max-width: 960px; margin: auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;">
        <p style="margin: 0 0 0.5em 0; flex: 1;">We use cookies to enhance your experience and embed a Google Form. You can choose to allow analytics and marketing cookies.</p>
        <div style="display: flex; gap: 0.5em;">
          <button id="acceptAllCookies" style="padding: 0.5em 1em; background: green; color: white; border: none; cursor: pointer;">Accept All</button>
          <button id="customCookies" style="padding: 0.5em 1em; background: green; color: white; border: none; cursor: pointer;">Set Preferences</button>
          <button id="declineCookies" style="padding: 0.5em 1em; background: grey; color: white; border: none; cursor: pointer;">Decline</button>
        </div>
      </div>`;
    document.body.appendChild(banner);

    document.getElementById('acceptAllCookies').onclick = () => {
      setConsent({ required: true, analytics: true, marketing: true });
      applyConsentToDOM();
    };
    document.getElementById('customCookies').onclick = () => {
      window.location.href = 'cookie-policy.html';
    };
    document.getElementById('declineCookies').onclick = () => {
      setConsent({ required: true, analytics: false, marketing: false });
      applyConsentToDOM();
    };
  }

  // Optional DOM shortcut (the main toggling is in site-consent-loader.js)
  function applyConsentToDOM() {
    if (window.cookieConsent?.analytics) {
      const container = document.getElementById('formContainer');
      const fallback  = document.getElementById('formLink');
      if (container && fallback) {
        container.style.display = 'block';
        fallback.style.display = 'none';
      }
    }
  }

  // ---- Load from storage (with migration) ----
  (function initConsent() {
    // migrate from OLD_KEY if present
    const old = localStorage.getItem(OLD_KEY);
    if (old && !localStorage.getItem(KEY)) {
      try {
        localStorage.setItem(KEY, old);
        localStorage.removeItem(OLD_KEY);
      } catch {}
    }
    const saved = localStorage.getItem(KEY);
    if (saved) {
      try {
        window.cookieConsent = JSON.parse(saved);
        emitConsentUpdated();
        applyConsentToDOM();
        return;
      } catch {}
    }
    showBanner();
  })();

  document.addEventListener('cookieConsentUpdated', applyConsentToDOM);
})();
