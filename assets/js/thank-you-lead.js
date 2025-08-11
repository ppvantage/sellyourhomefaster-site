// /assets/js/thank-you-lead.js
(function () {
  function trackLeadIfAllowed() {
    if (window.cookieConsent?.marketing && window.fbq) {
      const params = new URLSearchParams(location.search);
      const eventId = params.get('eid'); // optional dedup if you also send CAPI
      if (eventId) fbq('track', 'Lead', {}, { eventID: eventId });
      else fbq('track', 'Lead');
    }
  }
  function render() { trackLeadIfAllowed(); }
  document.addEventListener('DOMContentLoaded', render);
  window.addEventListener('cookieConsentUpdated', render);
})();
