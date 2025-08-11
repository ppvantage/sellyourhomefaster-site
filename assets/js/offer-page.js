// /assets/js/offer-page.js
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#formLink a, #formLink2 a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.cookieConsent?.marketing && typeof fbq === 'function') {
          fbq('trackCustom', 'CTA_Click', { location: 'offer_page' });
        }
      });
    });
  });
})();
