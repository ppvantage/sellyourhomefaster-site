// cookie-consent.js
(function () {
  const isPolicyPage = window.location.pathname.includes('cookie-policy');

  function setConsent(consent) {
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    window.cookieConsent = consent;
    document.getElementById('cookie-banner')?.remove();
    document.dispatchEvent(new Event('cookieConsentUpdated'));
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
      setConsent({ required:true, analytics: true, marketing: true });
	  applyConsentToDOM();
    };
	document.getElementById('customCookies').onclick = () => {
      window.location.href = 'cookie-policy.html';
    };
    document.getElementById('declineCookies').onclick = () => {
      setConsent({ required:true, analytics: false, marketing: false });
	  applyConsentToDOM();
    };
  }

  function applyConsentToDOM() {
    if (window.cookieConsent && window.cookieConsent.analytics) {
      const container = document.getElementById('formContainer');
      const fallback = document.getElementById('formLink');
      if (container && fallback) {
        container.style.display = 'block';
        fallback.style.display = 'none';
      }
    }
  }

  // Check saved consent or show banner
  const saved = localStorage.getItem('cookieConsent');
  if (saved) {
    try {
      window.cookieConsent = JSON.parse(saved);
      document.dispatchEvent(new Event('cookieConsentUpdated'));
      applyConsentToDOM();
    } catch (e) {
      showBanner();
    }
  } else {
    showBanner();
  }

  document.addEventListener('cookieConsentUpdated', applyConsentToDOM);
})();
