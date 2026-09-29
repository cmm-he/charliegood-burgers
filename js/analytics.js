window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-58G6NE9V0Z');

/* Conversiones: clic en WhatsApp segmentado por categoría */
(function () {
  function categoriaGA(link) {
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
    if (!link) return;
    gtag('event', 'whatsapp_click', {
      event_category: 'conversion',
      event_label: categoriaGA(link)
    });
  });
}());
