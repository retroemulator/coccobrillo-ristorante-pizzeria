/* ============================================================
   RISTORANTE PIZZERIA COCCOBRILLO — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. NAVBAR SCROLL ---------- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 2. HAMBURGER MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('nav-mobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navMobile.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    // Chiudi al click su un link mobile
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 3. ACTIVE NAV LINK ---------- */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.replace(/\/$/, '');
    if (
      currentPath.endsWith(linkPath) ||
      (currentPath === '/' || currentPath.endsWith('index.html')) && (linkPath === 'index.html' || linkPath === '/')
    ) {
      link.classList.add('active');
    }
  });

  /* ---------- 4. REVEAL ON SCROLL ---------- */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  } else {
    // Graceful degradation
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  /* ---------- 5. FORM SUBMIT (Formspree async) ---------- */
  document.querySelectorAll('.contact-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn    = form.querySelector('[type="submit"]');
      const msgEl  = form.querySelector('.form-msg');
      if (!btn || !msgEl) return;

      btn.disabled = true;
      btn.textContent = btn.dataset.sending || 'Invio…';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          msgEl.textContent = btn.dataset.success || 'Grazie! Ti risponderemo al più presto.';
          msgEl.className = 'form-msg success';
          msgEl.style.display = 'block';
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch {
        msgEl.textContent = btn.dataset.error || 'Si è verificato un errore. Riprova o chiamaci al 011 901 6721.';
        msgEl.className = 'form-msg error';
        msgEl.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.textContent = btn.dataset.label || 'Invia Prenotazione';
        setTimeout(() => { msgEl.style.display = 'none'; }, 7000);
      }
    });
  });

  /* ---------- 6. SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 16 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- 7. LANGUAGE SWITCHER ---------- */
  const savedLang = localStorage.getItem('coccobrillo_lang') || 'it';
  setLang(savedLang, false);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLang(lang, true);
    });
  });

  function setLang(lang, save) {
    document.body.classList.toggle('lang-en', lang === 'en');
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    if (save) localStorage.setItem('coccobrillo_lang', lang);
  }

  /* ---------- 8. GIFT CARD POPUP (homepage only) ---------- */
  const popup = document.getElementById('giftcard-popup');
  if (popup) {
    const POPUP_KEY = 'coccobrillo_popup_closed';
    const lastClosed = parseInt(localStorage.getItem(POPUP_KEY) || '0', 10);
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;

    if (now - lastClosed > DAY) {
      setTimeout(() => {
        popup.classList.remove('hidden');
        requestAnimationFrame(() => popup.classList.add('visible'));
      }, 3000);
    }

    const closeBtn = popup.querySelector('.popup-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        popup.classList.remove('visible');
        setTimeout(() => popup.classList.add('hidden'), 400);
        localStorage.setItem(POPUP_KEY, String(Date.now()));
      });
    }
  }

});
