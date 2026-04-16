/* ============================================================
   RISTORANTE PIZZERIA COCCOBRILLO — cookie-consent.js
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'cookie_consent';
  var EXPIRY_DAYS = 365;

  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      var age = (Date.now() - data.ts) / (1000 * 60 * 60 * 24);
      if (age > EXPIRY_DAYS) { localStorage.removeItem(STORAGE_KEY); return null; }
      return data.value; // 'accepted' | 'refused'
    } catch (e) { return null; }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: value, ts: Date.now() }));
    } catch (e) {}
  }

  function applyConsent(value) {
    if (value === 'accepted') {
      loadMaps();
    } else if (value === 'refused') {
      blockMaps();
    }
  }

  function loadMaps() {
    document.querySelectorAll('[data-osm-src]').forEach(function (el) {
      if (el.tagName === 'IFRAME') {
        el.src = el.getAttribute('data-osm-src');
      }
    });
    document.querySelectorAll('.map-placeholder').forEach(function (el) {
      el.style.display = 'none';
    });
    document.querySelectorAll('.map-iframe-wrap').forEach(function (el) {
      el.style.display = '';
    });
  }

  function blockMaps() {
    document.querySelectorAll('[data-osm-src]').forEach(function (el) {
      if (el.tagName === 'IFRAME') el.src = 'about:blank';
    });
    document.querySelectorAll('.map-iframe-wrap').forEach(function (el) {
      el.style.display = 'none';
    });
    document.querySelectorAll('.map-placeholder').forEach(function (el) {
      el.style.display = 'block';
    });
  }

  function showBanner() {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.classList.remove('hidden');
    requestAnimationFrame(function () { banner.classList.add('visible'); });
  }

  function hideBanner() {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.classList.remove('visible');
    setTimeout(function () { banner.classList.add('hidden'); }, 400);
  }

  window.resetCookieConsent = function () {
    localStorage.removeItem(STORAGE_KEY);
    var banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.remove('hidden');
      requestAnimationFrame(function () { banner.classList.add('visible'); });
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var consent = getConsent();

    if (consent) {
      applyConsent(consent);
    } else {
      blockMaps(); // blocca di default
      showBanner();
    }

    var btnAccept = document.getElementById('cookie-accept');
    var btnRefuse = document.getElementById('cookie-refuse');

    if (btnAccept) {
      btnAccept.addEventListener('click', function () {
        saveConsent('accepted');
        applyConsent('accepted');
        hideBanner();
      });
    }
    if (btnRefuse) {
      btnRefuse.addEventListener('click', function () {
        saveConsent('refused');
        applyConsent('refused');
        hideBanner();
      });
    }
  });
})();
