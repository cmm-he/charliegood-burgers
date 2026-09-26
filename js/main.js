/* Popup de WhatsApp (aparece una vez por visitante) */
(function () {
  var STORAGE_KEY = 'cg_popup_seen';
  var SHOW_DELAY  = 25000;
  var COUNTDOWN   = 10;

  if (localStorage.getItem(STORAGE_KEY) === 'seen') return;

  var overlay  = document.getElementById('wa-popup-overlay');
  var closeBtn = document.getElementById('wa-popup-close');
  var timerEl  = document.getElementById('wa-popup-timer');
  var ctaBtn   = document.getElementById('wa-popup-cta');
  var interval;

  function closePopup() {
    overlay.classList.remove('is-visible');
    localStorage.setItem(STORAGE_KEY, 'seen');
    clearInterval(interval);
    document.body.style.overflow = '';
  }

  function startCountdown() {
    var secs = COUNTDOWN;
    timerEl.textContent = secs;
    interval = setInterval(function () {
      secs -= 1;
      timerEl.textContent = secs;
      if (secs <= 0) { clearInterval(interval); closePopup(); }
    }, 1000);
  }

  function showPopup() {
    console.log('popup activado');
    overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    startCountdown();
  }

  closeBtn.addEventListener('click', closePopup);
  ctaBtn.addEventListener('click', closePopup);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closePopup();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-visible')) closePopup();
  });

  setTimeout(showPopup, SHOW_DELAY);
}());

/* Menú móvil */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu   = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    menu.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  /* Cerrar al hacer click en un link del menú */
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* Cerrar con tecla Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
  });
}());

/* META PIXEL: evento Contact al hacer clic en cualquier botón de WhatsApp */
(function () {
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="https://wa.me/"]');
    if (link && typeof fbq === 'function') {
      fbq('track', 'Contact');
    }
  });
}());
