(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SUN = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19v2.4M21.5 12h-2.4M4.9 12H2.5M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3 5.6 5.6"/></svg>`;
  const MOON = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>`;
  const EYE = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3.2"/></svg>`;
  const EYE_OFF = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.2A11 11 0 0 1 12 5c7 0 10.5 7 10.5 7a13.6 13.6 0 0 1-3.2 4.1M6.5 6.6C3.4 8.6 1.5 12 1.5 12s3.5 7 10.5 7a10.6 10.6 0 0 0 3.6-.6"/><path d="M9.5 9.7a3.2 3.2 0 0 0 4.6 4.5"/></svg>`;

  function store(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function setStore(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }

  /* ---------------------------- Theme ---------------------------- */
  function initTheme() {
    const saved = store('vertex_theme', 'dark');
    if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.innerHTML = saved === 'light' ? MOON : SUN;
      btn.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const next = isLight ? 'dark' : 'light';
        if (next === 'light') document.documentElement.setAttribute('data-theme', 'light');
        else document.documentElement.removeAttribute('data-theme');
        setStore('vertex_theme', next);
        document.querySelectorAll('[data-theme-toggle]').forEach(b => b.innerHTML = next === 'light' ? MOON : SUN);
      });
    });
  }

  /* ---------------------------- Custom cursor ---------------------------- */
  function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring || reduceMotion || matchMedia('(hover: none)').matches) return;
    let rx = 0, ry = 0, x = 0, y = 0;
    window.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; });
    (function loop() {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
    });
  }

  /* ---------------------------- Toasts ---------------------------- */
  function toast(message, type = 'success') {
    const stack = document.getElementById('toast-stack');
    if (!stack) return;
    const el = document.createElement('div');
    el.className = 'toast' + (type === 'error' ? ' error' : '');
    el.innerHTML = `<i></i><span>${message}</span>`;
    stack.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, 3200);
  }

  /* ---------------------------- Tabs ---------------------------- */
  function initTabs() {
    const tabs = document.querySelectorAll('[data-auth-tab]');
    const panels = document.querySelectorAll('[data-auth-panel]');
    function activate(name) {
      tabs.forEach(t => t.classList.toggle('active', t.dataset.authTab === name));
      panels.forEach(p => p.style.display = (p.dataset.authPanel === name ? '' : 'none'));
    }
    tabs.forEach(t => t.addEventListener('click', () => activate(t.dataset.authTab)));
    document.querySelectorAll('[data-switch-to]').forEach(a => a.addEventListener('click', (e) => {
      e.preventDefault();
      activate(a.dataset.switchTo);
    }));
  }

  /* ---------------------------- Password visibility ---------------------------- */
  function initPasswordToggles() {
    document.querySelectorAll('[data-toggle-pass]').forEach(btn => {
      btn.innerHTML = EYE;
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.togglePass);
        if (!input) return;
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = show ? EYE_OFF : EYE;
      });
    });
  }

  /* ---------------------------- Validation + mock submit ---------------------------- */
  function setInvalid(groupEl, invalid) { groupEl && groupEl.classList.toggle('invalid', invalid); }

  function initForms() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    loginForm && loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email');
      const password = document.getElementById('login-password');
      let ok = true;
      const emailGroup = loginForm.querySelector('[data-group="login-email"]');
      const passGroup = loginForm.querySelector('[data-group="login-password"]');
      setInvalid(emailGroup, !email.checkValidity()); if (!email.checkValidity()) ok = false;
      setInvalid(passGroup, !password.checkValidity()); if (!password.checkValidity()) ok = false;
      if (!ok) { toast('Check the highlighted fields.', 'error'); return; }
      submitMock(loginForm, 'Welcome back', `Signed in as ${email.value}. This is a demo — no real account was accessed.`);
    });

    signupForm && signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name');
      const email = document.getElementById('signup-email');
      const password = document.getElementById('signup-password');
      const terms = document.getElementById('agree-terms');
      let ok = true;
      const nameGroup = signupForm.querySelector('[data-group="signup-name"]');
      const emailGroup = signupForm.querySelector('[data-group="signup-email"]');
      const passGroup = signupForm.querySelector('[data-group="signup-password"]');
      setInvalid(nameGroup, !name.checkValidity()); if (!name.checkValidity()) ok = false;
      setInvalid(emailGroup, !email.checkValidity()); if (!email.checkValidity()) ok = false;
      setInvalid(passGroup, !password.checkValidity()); if (!password.checkValidity()) ok = false;
      if (!terms.checked) { toast('Please agree to the Terms to continue.', 'error'); ok = false; }
      if (!ok) return;
      submitMock(signupForm, 'Account created', `Welcome, ${name.value.split(' ')[0]}. This is a demo — no real account was created.`);
    });

    document.querySelectorAll('[data-social]').forEach(btn => {
      btn.addEventListener('click', () => toast(`${btn.dataset.social} sign-in isn\u2019t wired up in this demo.`));
    });

    document.getElementById('forgot-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      toast('Password reset isn\u2019t wired up in this demo.');
    });
  }

  function submitMock(form, title, subtitle) {
    const btn = form.querySelector('button[type="submit"]');
    btn.classList.add('loading');
    btn.disabled = true;
    setTimeout(() => {
      btn.classList.remove('loading');
      btn.disabled = false;
      document.getElementById('auth-forms').style.display = 'none';
      const success = document.getElementById('auth-success');
      document.getElementById('auth-success-title').textContent = title;
      document.getElementById('auth-success-sub').textContent = subtitle;
      success.classList.add('show');
    }, 1100);
  }

  /* ---------------------------- 3D visual ---------------------------- */
  function initScene() {
    const canvas = document.getElementById('login-canvas');
    if (!canvas || typeof createCoreScene !== 'function') return;
    try {
      createCoreScene(canvas, { particleCount: 500, cameraZ: 6.5, parallax: 0.5, scale: 0.9 });
    } catch (e) { /* fall back silently to the gradient background */ }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCursor();
    initTabs();
    initPasswordToggles();
    initForms();
    initScene();
  });
})();
