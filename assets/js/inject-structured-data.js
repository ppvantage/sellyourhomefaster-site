// Inject external JSON-LD as an inline script so search engines definitely see it
(function () {
  const url = '/assets/faq.jsonld';
  fetch(url, { cache: 'no-store' })
    .then(r => r.ok ? r.text() : Promise.reject(new Error(r.statusText)))
    .then(json => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.text = json;                // inline the JSON-LD
      document.head.appendChild(s); // add to <head>
    })
    .catch(() => { /* silently ignore */ });
})();
