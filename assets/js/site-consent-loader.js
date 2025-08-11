// /assets/js/site-consent-loader.js
(function () {
  // Elements (some pages may not have all of these)
  const leadform      = document.getElementById('leadform');
  const formContainer = document.getElementById('formContainer');
  const leadcontentArea  = document.getElementById('leadcontent');
  const link1         = document.getElementById('formLink');
  const link2         = document.getElementById('formLink2');
  const form          = document.getElementById('embeddedForm');

  // Use your real Google Forms EMBED URL
  const GOOGLE_FORM_EMBED_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScgkmQURrSfpuYu4FChic5PWcYIwLIhRotyxBoalHqvle684w/viewform';

  let fbqLoaded = false;

  function getConsent() {
    const c = window.cookieConsent || {};
    return { marketing: !!c.marketing, analytics: !!c.analytics };
  }

  function loadMetaPixelOnce() {
    if (fbqLoaded) return;
    const pre = document.createElement('link');
    pre.rel = 'preconnect';
    pre.href = 'https://connect.facebook.net';
    document.head.appendChild(pre);

    !function(f,b,e,v,n,t,s){
      if(f.fbq) return;
      n=f.fbq=function(){ n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments) };
      if(!f._fbq) f._fbq=n;
      n.push=n; n.loaded=!0; n.version='2.0';
      n.queue=[];
      t=b.createElement(e); t.async=!0; t.src=v;
      s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', '739437179064972');
    fbq('track', 'PageView');
    fbqLoaded = true;
  }

  function show(el) { if (el) el.style.display = 'block'; }
  function hide(el) { if (el) el.style.display = 'none'; }

  function showEmbed() {
    show(leadform);
    show(formContainer);
    hide(leadcontentArea);
    hide(link1);
    hide(link2);

    if (form && !form.src) {
      const pre2 = document.createElement('link');
      pre2.rel = 'preconnect';
      pre2.href = 'https://docs.google.com';
      document.head.appendChild(pre2);
      form.src = GOOGLE_FORM_EMBED_URL;
    }
  }

  function hideEmbed() {
    hide(leadform);
    hide(formContainer);
    if (form) form.removeAttribute('src');
    show(leadcontentArea);
    show(link1);
    show(link2);
  }

  function renderByConsent() {
    const { marketing, analytics } = getConsent();
    if (marketing) loadMetaPixelOnce();
    analytics ? showEmbed() : hideEmbed();
  }

  document.addEventListener('DOMContentLoaded', renderByConsent);

  // Listen on BOTH window and document (your consent script dispatches on document)
  window.addEventListener('cookieConsentUpdated', renderByConsent);
  document.addEventListener('cookieConsentUpdated', renderByConsent);

  // Small fallback in case consent is set shortly after load
  let tries = 0;
  const iv = setInterval(() => {
    renderByConsent();
    if (++tries >= 10) clearInterval(iv);
  }, 500);
})();
