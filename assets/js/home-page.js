(function () {
  function trackCTA(e) {
    if (window.cookieConsent?.marketing && typeof fbq === 'function') {
      fbq('trackCustom', 'CTA_Click', { location: 'home_header' });
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    const cta = document.getElementById('ctaCashOffer');
    if (cta) cta.addEventListener('click', trackCTA);
  });

  // If consent toggles while the page is open, nothing to change here—
  // we check consent at click time.
})();
