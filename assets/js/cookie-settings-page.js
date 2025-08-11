// Cookie settings page controller
(function () {
  const KEY = 'syhf_cookie_consent_v1'; // must match cookie-consent.js
  const form = document.getElementById('cookie-settings');
  const analytics = document.getElementById('analyticsConsent');
  const marketing = document.getElementById('marketingConsent');
  const saveStatus = document.getElementById('saveStatus');
  const allowAllBtn = document.getElementById('allowAllBtn');
  const rejectAllBtn = document.getElementById('rejectAllBtn');

  function readStored() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  }
  function writeStored(v) { localStorage.setItem(KEY, JSON.stringify(v)); }
  function setGlobal(consent) {
    window.cookieConsent = {
      necessary: true,
      analytics: !!consent.analytics,
      marketing: !!consent.marketing
    };
    // Notify any listeners (e.g., site-consent-loader.js)
    window.dispatchEvent(new Event('cookieConsentUpdated'));
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

  document.addEventListener('DOMContentLoaded', () => {
    const stored = readStored();
    if (stored && (stored.analytics !== undefined || stored.marketing !== undefined)) {
      setGlobal(stored);
      reflectUI(stored);
    } else {
      reflectUI({ analytics: false, marketing: false });
    }
  });

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
