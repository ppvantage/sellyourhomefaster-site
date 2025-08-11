// cookie-settings-page.js
(function () {
  const KEY = 'syhf_cookie_consent_v1';
  const OLD_KEY = 'cookieConsent'; // migrate from this if still around

  const form       = document.getElementById('cookie-settings');
  const analytics  = document.getElementById('analyticsConsent');
  const marketing  = document.getElementById('marketingConsent');
  const saveStatus = document.getElementById('saveStatus');
  const allowAllBtn  = document.getElementById('allowAllBtn');
  const rejectAllBtn = document.getElementById('rejectAllBtn');

  // --- storage helpers ---
  function readStored() {
    try {
      // migrate once if OLD_KEY exists and KEY does not
      const old = localStorage.getItem(OLD_KEY);
      const cur = localStorage.getItem(KEY);
      if (old && !cur) {
        localStorage.setItem(KEY, old);
        localStorage.removeItem(OLD_KEY);
      }
      return JSON.parse(localStorage.getItem(KEY) || '{}');
    } catch { return {}; }
  }
  function writeStored(v) {
    localStorage.setItem(KEY, JSON.stringify(v));
  }

  // Emit to both targets unless a global helper is available
  function emitConsentUpdated() {
    if (typeof window.emitConsentUpdated === 'function') {
      window.emitConsentUpdated();
      return;
    }
    const evt = new Event('cookieConsentUpdated');
    document.dispatchEvent(evt);
    window.dispatchEvent(evt);
  }

  function setGlobal(consent) {
    // Keep the object shape consistent across the site
    window.cookieConsent = {
      analytics: !!consent.analytics,
      marketing: !!consent.marketing
      // (omit extra flags like "required"/"necessary" to avoid drift)
    };
    emitConsentUpdated();
  }

  function reflectUI(consent) {
    if (analytics) analytics.checked = !!consent.analytics;
    if (marketing) marketing.checked = !!consent.marketing;
  }

  function showSaved() {
    if (!saveStatus) return;
    saveStatus.style.display = 'block';
    setTimeout(() => { saveStatus.style.display = 'none'; }, 2500);
  }

  // --- init ---
  document.addEventListener('DOMContentLoaded', () => {
    const stored = readStored();
    if (stored && (stored.analytics !== undefined || stored.marketing !== undefined)) {
      setGlobal(stored);
      reflectUI(stored);
    } else {
      reflectUI({ analytics: false, marketing: false });
    }
  });

  // --- events ---
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const consent = { analytics: !!analytics.checked, marketing: !!marketing.checked };
      writeStored(consent);
      setGlobal(consent);
      showSaved();
    });
  }

  if (allowAllBtn) {
    allowAllBtn.addEventListener('click', () => {
      const consent = { analytics: true, marketing: true };
      writeStored(consent);
      setGlobal(consent);
      reflectUI(consent);
      showSaved();
    });
  }

  if (rejectAllBtn) {
    rejectAllBtn.addEventListener('click', () => {
      const consent = { analytics: false, marketing: false };
      writeStored(consent);
      setGlobal(consent);
      reflectUI(consent);
      showSaved();
    });
  }
})();
