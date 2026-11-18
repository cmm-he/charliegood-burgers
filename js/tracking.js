/* Medición con consentimiento: Google Analytics 4 y Meta Pixel
   solo se cargan después de que el visitante acepta en el aviso de cookies.
   La elección se guarda en localStorage ('granted' o 'denied'). */
(function () {
  var GA_ID = 'G-0E958B581L';
  var PIXEL_ID = '3209132552615848';
  var KEY = 'cg_consent';
  var loaded = false;

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function saveChoice(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* sin almacenamiento: se vuelve a preguntar */ }
  }

  function loadScript(src) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  function loadTracking() {
    if (loaded) return;
    loaded = true;

    /* Google Analytics 4 */
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + GA_ID);

    /* Meta Pixel */
    if (!window.fbq) {
      var n = window.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!window._fbq) window._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      loadScript('https://connect.facebook.net/en_US/fbevents.js');
    }
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  /* Al retirar el consentimiento, se borran las cookies de medición ya creadas */
  function clearTrackingCookies() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (/^(_ga|_gid|_gat|_fbp|_fbc)/.test(name)) {
        ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  /* Conversiones: clic en WhatsApp, segmentado por sección */
  function categoria(link) {
    if (link.closest('.mayorista'))        return 'mayorista';
    if (link.closest('.eventos-cg'))       return 'eventos';
    if (link.closest('.product-card'))     return 'producto';
    if (link.closest('#wa-popup-overlay')) return 'popup';
    if (link.closest('.channel-card'))     return 'canales';
    if (link.closest('.contact'))          return 'contacto';
    return 'otro';
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="https://wa.me/"]');
    if (!link || !loaded) return;
    var cat = categoria(link);
    window.gtag('event', 'whatsapp_click', { event_category: 'conversion', event_label: cat });
    window.fbq('track', 'Contact');
    window.fbq('trackCustom', 'WhatsAppClick', { categoria: cat });
  });

  /* Aviso de cookies */
  function init() {
    var banner = document.getElementById('cookie-banner');

    function show() {
      if (!banner) return;
      banner.hidden = false;
      document.documentElement.classList.add('consent-open');
    }
    function hide() {
      if (!banner) return;
      banner.hidden = true;
      document.documentElement.classList.remove('consent-open');
    }

    document.addEventListener('click', function (e) {
      var choiceBtn = e.target.closest('[data-cookie-choice]');
      if (choiceBtn) {
        var value = choiceBtn.getAttribute('data-cookie-choice');
        var previous = getChoice();
        saveChoice(value);
        hide();
        if (value === 'granted') {
          loadTracking();
        } else if (previous === 'granted' || loaded) {
          clearTrackingCookies();
          location.reload(); /* descarga los scripts de medición ya cargados */
        }
        return;
      }
      if (e.target.closest('[data-cookie-settings]')) show();
    });

    var choice = getChoice();
    if (choice === 'granted') loadTracking();
    else if (choice !== 'denied') show();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
