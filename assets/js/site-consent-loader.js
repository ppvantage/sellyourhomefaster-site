// /assets/js/site-consent-loader.js
(function () {
	  // Cache elements
	  const leadform = document.getElementById('leadform');
	  const formContainer = document.getElementById('formContainer');
	  const content = document.getElementById('content');
	  const link1 = document.getElementById('formLink');
	  const link2 = document.getElementById('formLink2');
	  const form = document.getElementById('embeddedForm');
	
	  // IMPORTANT: use the Google Forms *embed* URL (example placeholder below)
	  const GOOGLE_FORM_EMBED_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScgkmQURrSfpuYu4FChic5PWcYIwLIhRotyxBoalHqvle684w/viewform?embedded=true';

	  let fbqLoaded = false;
	
	  function getConsent() {
	    const c = window.cookieConsent || {};
	    return {
	      marketing: !!c.marketing,
	      analytics: !!c.analytics
	    };
	  }
	
	  function loadMetaPixelOnce() {
	    if (fbqLoaded) return;
	
	    // Optional perf: preconnect
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
	
	    fbq('init', '123456789012345');
	    fbq('track', 'PageView');
	    fbqLoaded = true;
	  }
	
	  function showEmbed() {
	    if (leadform) leadform.style.display = 'block';
	    if (formContainer) formContainer.style.display = 'block';
	    if (leadcontent) content.style.display = 'none';
	    if (link1) link1.style.display = 'none';
	    if (link2) link2.style.display = 'none';
	
	    if (form && !form.src) {
	      // Optional perf: preconnect to docs.google.com
	      const pre2 = document.createElement('link');
	      pre2.rel = 'preconnect';
	      pre2.href = 'https://docs.google.com';
	      document.head.appendChild(pre2);
	
	      form.src = GOOGLE_FORM_EMBED_URL;
	    }
	  }
	
	  function hideEmbed() {
	    if (leadform) leadform.style.display = 'none';
	    if (formContainer) formContainer.style.display = 'none';
	    if (leadcontent) content.style.display = 'block';
	    if (link1) link1.style.display = 'block';
	    if (link2) link2.style.display = 'block';
	    if (form) form.removeAttribute('src'); // prevent third‑party load without consent
	  }
	
	  function renderByConsent() {
	    const { marketing, analytics } = getConsent();
	    if (marketing) loadMetaPixelOnce();
	    if (analytics) showEmbed();
	    else hideEmbed();
	  }
	
	  // Initial render
	  document.addEventListener('DOMContentLoaded', renderByConsent);
	
	  // React to your consent script’s event
	  window.addEventListener('cookieConsentUpdated', renderByConsent);
	
	  // Small safety: poll for up to 5s in case the event fires before listeners attach or lib is slow
	  let tries = 0;
	  const iv = setInterval(() => {
	    renderByConsent();
	    if (++tries >= 10) clearInterval(iv);
	  }, 500);
	})();
